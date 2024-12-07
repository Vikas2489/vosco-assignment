// app/api/scrape/route.js
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cityName = searchParams.get('cityName');

  if (!cityName) {
    return new Response(JSON.stringify({ error: 'City name is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = `https://www.magicbricks.com/new-projects-${cityName}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const projects = [];

    $('.projdis__prjcard').each((index, element) => {
      const projectName = $(element)
        .find('.mghome__prjblk__prjname')
        .text()
        .trim();
      const location = $(element)
        .find('.mghome__prjblk__locname')
        .text()
        .trim();
      const priceRange = $(element)
        .find('.mghome__prjblk__price')
        .text()
        .trim();

      if (projectName || location || priceRange) {
        projects.push({
          projectName,
          location,
          priceRange,
          builderName: 'not-provided',
        });
      }
    });

    return new Response(JSON.stringify({ data: projects }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching data:', error, error.message);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch data. Check the URL or selectors.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
