export default async function handler(_, res) {

    try {
        const LIST_ID = process.env.LIST_ID
        const API_KEY = process.env.API_KEY
        const DATACENTER = API_KEY.split('-')[1];
        const response = await fetch(`https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            method: 'GET'
        });

        console.log(response.status)
        console.log(response.statusText)

        const { count } = await response.json();

        res.setHeader(
            'Cache-Control',
            'public, s-maxage=1200, stale-while-revalidate=600'
        );
        return res.status(200).json({ count });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message || error.toString() });
    }


}