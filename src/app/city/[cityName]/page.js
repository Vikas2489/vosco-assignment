import React from 'react';
import ProjectList from '../ProjectList';

async function CityProjects({ params }) {
  const { cityName } = await params;

  return (
    <div className="flex p-[2rem] flex-wrap">
      <h1 className="text-2xl basis-[100%] my-[1.5rem] font-bold text-center">
        Projects in {cityName}
      </h1>
      <ProjectList cityName={cityName} />
    </div>
  );
}

export default CityProjects;
