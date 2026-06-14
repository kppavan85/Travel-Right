import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

function url(v) {
  if (!v) return null;
  if (typeof v === 'string') return v;
  if (Array.isArray(v) && v[0]) return v[0].url || null;
  return null;
}

function sel(v) {
  if (!v) return null;
  if (typeof v === 'object' && v.name) return v.name;
  return v;
}

export async function GET() {
  try {
    const records = [];
    await base(process.env.AIRTABLE_TABLE_ID)
      .select({ pageSize: 100 })
      .eachPage((rows, next) => {
        rows.forEach(r => {
          records.push({
            id:                r.id,
            destination:       r.get('destination'),
            state:             r.get('state'),
            category:          sel(r.get('category')),
            nickname:          r.get('nickname'),
            emoji:             r.get('emoji'),
            gem:               r.get('is_hidden_gem'),
            best_for:          r.get('best_for'),
            month:             r.get('month_text') || sel(r.get('month')),
            trip_duration:     r.get('trip_duration'),
            overall_rating:    r.get('overall_rating'),
            safety:            r.get('safety_rating'),
            beauty:            r.get('beauty_rating'),
            food:              r.get('food_rating'),
            budget:            r.get('budget_rating'),
            transport:         r.get('transport_rating'),
            crowd_free:        r.get('crowd_free_rating'),
            weather:           r.get('weather_rating'),
            stays:             r.get('stays_rating'),
            short_desc:        r.get('short_description'),
            tags:              r.get('tags'),
            why_this_month:    r.get('why_this_month'),
            travel_intel:      r.get('travel_intel'),
            must_do:           r.get('must_do'),
            warnings:          r.get('warnings'),
            budget_min:        r.get('budget_min_inr'),
            budget_max:        r.get('budget_max_inr'),
            nearest_airport:   r.get('nearest_airport'),
            airport_1_options: r.get('airport_1_options'),
            airport_2:         r.get('airport_2'),
            airport_2_options: r.get('airport_2_options'),
            airport_insight:   r.get('airport_insight'),
            nearest_railway:   r.get('nearest_railway'),
            railway_options:   r.get('railway_travel_options'),
            nearest_bus:       r.get('nearest_bus_stand'),
            bus_services:      r.get('bus_direct_services'),
            image_1:           url(r.get('image_1_url')),
            image_2:           url(r.get('image_2_url')),
            image_3:           url(r.get('image_3_url')),
          });
        });
        next();
      });
    return Response.json({ records });
  } catch (e) {
    console.error(e);
    return Response.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}
