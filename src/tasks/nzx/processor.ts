import axios from 'axios';
import cheerio from 'cheerio';
import { Job } from 'bull';
import { createConnection, Connection } from 'typeorm';
import { Listing, Price } from '@entities';
import { typeormConfig } from '@configs';

async function FetchData(job: Job): Promise<string> {
  try {
    // Request the most recent live data
    const NZXURL = process.env.URL || 'https://www.nzx.com/markets/NZSX';
    const { data } = await axios.get(NZXURL);

    // Success geting new data
    job.log(`NZX data collected at: ${+new Date()}`);
    return data;
  } catch (e) {
    // Log the error to the job
    job.log('Unable to request data from NZX');
    job.log(e);
    Promise.reject();
  }
}

export async function PriceProcessor(job: Job): Promise<void> {
  let html: string;

  const timestamp = new Date();

  // Get the data ready for processing
  try {
    html = await FetchData(job);
  } catch {
    // Bull will move this job to the failed queue
    Promise.reject();
  }

  const prices: Price[] = [];

  const $ = cheerio.load(html);
  $('#instruments-table > tbody > tr').each(function(i, elem) {
    const price = new Price();

    // Timestamp for this price index
    price.time = timestamp;

    // Listing code
    price.code = $(elem.children[1])
      .text()
      .trim();

    // Listing price
    price.price = +$(elem.children[5])
      .text()
      .trim()
      .replace('$', '');

    // Add this Price to the array to be inserted
    prices.push(price);
  });

  job.progress(75);
  job.log('All entries processed.');

  // Create the database connection ready to UPSERT
  const connection: Connection = await createConnection(typeormConfig);
  connection.getRepository(Price).save(prices);

  job.progress(100);
  job.log('Updated known listings in database');
  Promise.resolve();
}

// Listing processor

export async function ListingProcessor(job: Job): Promise<void> {
  let html: string;

  // Get the data ready for processing
  try {
    html = await FetchData(job);
  } catch {
    // Bull will move this job to the failed queue
    Promise.reject();
  }

  const listings: Listing[] = [];

  // Load the html string into cheerio to build the DOM
  const $ = cheerio.load(html);
  $('#instruments-table > tbody > tr').each(function(i, elem) {
    const listing = new Listing();
    listing.code = $(elem.children[1])
      .text()
      .trim();
    listing.company = $(elem.children[3])
      .text()
      .trim();

    listings.push(listing);
  });

  job.progress(75);
  job.log('All entries processed.');

  // Create the database connection ready to UPSERT
  const connection: Connection = await createConnection(typeormConfig);
  connection.getRepository(Listing).save(listings);

  job.progress(100);
  job.log('Updated known listings in database');
  Promise.resolve();
}
