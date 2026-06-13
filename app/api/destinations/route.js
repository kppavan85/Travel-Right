import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

export async function GET() {
  try {
    const records = [];

    await base(process.env.AIRTABLE_TABLE_ID)
      .select({ pageSize: 100 })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach((record) => {
          records.push({
            id: record.id,
            destination: record.get('destination'),
            state: record.get('state'),
            category: record.get('category'),
            nickname: record.get('nickname'),
            emoji: record.get('emoji'),
            gem: record.get('gem'),
            best_for: record.get('best_for'),
            month: record.get('month'),
            trip_duration: record.get('trip_duration'),
            overall_rating: record.get('overall_rating'),
            safety: record.get('safety'),
            beauty: record.get('beauty'),
            food: record.get('food'),
            budget: record.get('budget'),
            transport: record.get('transport'),
            crowd_free: record.get('crowd_free'),
            weather: record.get('weather'),
            stays: record.get('stays'),
            short_desc: record.get('short_desc'),
            crowd_level: record.get('crowd_level'),
            difficulty: record.get('difficulty'),
            tags: record.get('tags'),
            why_this_month: record.get('why_this_month'),
            travel_intel: record.get('travel_intel'),
            must_do: record.get('must_do'),
            warnings: record.get('warnings'),
            budget_min: record.get('budget_min'),
            budget_max: record.get('budget_max'),
            nearest_airport: record.get('nearest_airport'),
            airport_1_options: record.get('airport_1_options'),
            airport_2: record.get('airport_2'),
            airport_2_options: record.get('airport_2_options'),
            airport_insight: record.get('airport_insight'),
            nearest_railway: record.get('nearest_railway'),
            railway_options: record.get('railway_options'),
            nearest_bus: record.get('nearest_bus'),
            bus_services: record.get('bus_services'),
            image_1: record.get('image_1'),
            image_2: record.get('image_2'),
            image_3: record.get('image_3'),
          });
        });
        fetchNextPage();
      });

    return Response.json({ records });
  } catch (error) {
    console.error('Airtable error:', error);
    return Response.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
} 
