import fetch from 'isomorphic-unfetch';

export default async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const LIST_ID = process.env.LIST_ID
    const API_KEY = process.env.API_KEY
    const DATACENTER = API_KEY.split('-')[1];

    const data = {
      email_address: email,
      status: 'subscribed'
    };

    const response = await fetch(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
      {
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    );

    if (response.status == 400) {
      return res.status(400).json({
        error: `You've already added to my list.`
      });
    } else if (response.status > 400) {
      return res.status(400).json({
        error: `There was an error subscribing to the newsletter. Shoot me an email at [dangtrunganh@gmail.com] and I'll add you to the list.`
      });
    }

    return res.status(201).json({ error: '' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message || error.toString() });
  }
};