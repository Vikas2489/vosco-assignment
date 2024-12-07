import { useState } from 'react';
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const ProjectItem = ({ project, coordinates }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const mapContainerStyle = {
    height: '30vh',
    marginBottom: '1.3rem',
    borderRadius: '0.4rem',
  };
  return (
    <div className="project-item basis-[45%] border p-4 rounded shadow-lg mb-4">
      <h2 className="text-xl font-bold">{project.projectName}</h2>
      <p className="text-gray-700">Location: {project.location}</p>
      <p className="text-gray-700">Price Range: {project.priceRange}</p>
      <p className="text-gray-700">Builder: {project.builderName}</p>
      {coordinates.lat && coordinates.lng && (
        <LoadScript
          googleMapsApiKey={'AIzaSyA9t7wajXqKZ8SpUT1kDRUwY5Rp1MYylcc'}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={coordinates}
            zoom={15}
          >
            {coordinates.lat && (
              <Marker
                position={{ lat: coordinates.lat, lng: coordinates.lng }}
                onClick={() => setSelectedProject(project)}
              />
            )}

            {selectedProject && (
              <div
                className="info-window"
                style={{
                  position: 'absolute',
                  top: '0px',
                  backgroundColor: 'white',
                  padding: '10px',
                }}
              >
                <h2 className="text-xl font-bold">
                  {selectedProject.projectName}
                </h2>
                <p className="text-gray-700">
                  Location: {selectedProject.location}
                </p>
                <p className="text-gray-700">
                  Price Range: {selectedProject.priceRange}
                </p>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-red-500"
                >
                  Close
                </button>
              </div>
            )}
          </GoogleMap>
        </LoadScript>
      )}
      {/* 
      {coordinates.lat && coordinates.lng && (
        <LoadScript
          googleMapsApiKey={'AIzaSyA9t7wajXqKZ8SpUT1kDRUwY5Rp1MYylcc'}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={coordinates.lat ? coordinates : center}
            zoom={15}
          >
            {coordinates.lat && (
              <Marker position={{ lat: coordinates.lat, lng: coordinates.lng }}>
                ijonk
                <div className="marker-label">
                  <h2 className="text-xl font-bold">{project.projectName}</h2>
                  <p className="text-gray-700">Location: {project.location}</p>
                  <p className="text-gray-700">
                    Price Range: {project.priceRange}
                  </p>
                </div>
              </Marker>
            )}
          </GoogleMap>
        </LoadScript>
      )} */}
    </div>
  );
};

export default ProjectItem;
