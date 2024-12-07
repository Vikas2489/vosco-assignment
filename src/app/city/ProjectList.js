'use client';
import React, { useEffect, useState } from 'react';
import ProjectItem from './ProjectItem';

const ProjectList = ({ cityName }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [coordinatesMap, setCoordinatesMap] = useState({});

  const getCoordinates = async (address) => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${'AIzaSyA9t7wajXqKZ8SpUT1kDRUwY5Rp1MYylcc'}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      } else {
        console.error('No results found');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const fetchProjects = async () => {
    await setLoading(true);
    await setProgress(0); // Reset progress at the start

    try {
      const response = await fetch(`/api/scrape?cityName=${cityName}`);

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();

      await setProjects(() => data.data);
      // await setProgress(() => 50);

      const totalProjects = data.data.length;

      if (totalProjects === 0) {
        setLoading(false);
        return;
      }

      if (totalProjects > 0) {
        const coordsMap = {};
        const promises = data.data.map(async (project, index) => {
          const coords = await getCoordinates(project.location);
          coordsMap[project.location] = coords;

          // Update progress for each project
          const progressPercentage = ((index + 1) / totalProjects) * 50;
          await setProgress(progressPercentage);

          return coords;
        });

        await Promise.all(promises);

        setCoordinatesMap(() => coordsMap);
      }

      // await setProgress(100);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching projects or coordinates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchProjects();
    }
  }, [cityName]);

  if (loading) {
    return (
      <div className="flex flex-col basis-[100%] justify-center items-center h-screen">
        <p className="text-lg font-semibold">
          Loading... {Math.round(progress)}%
        </p>
        <div className="w-3/4 h-4 bg-gray-300 rounded-full mt-2">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-around">
      {projects.length > 0 &&
        projects.map((project) => (
          <ProjectItem
            key={project.projectName}
            project={project}
            coordinates={coordinatesMap[project.location]}
          />
        ))}
    </div>
  );
};

export default ProjectList;
