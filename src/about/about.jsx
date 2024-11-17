import React from 'react';
import './about.css';

export function About(props) {
  const [imageUrl, setImageUrl] = React.useState('Hawaii.jpg');
  const [quote, setQuote] = React.useState('Loading');
  const [quoteAuthor, setQuoteAuthor] = React.useState('Unknown');

  // Only runs on the initial render
  React.useEffect(() => {
    const random = Math.floor(Math.random() * 1000); // Generate a seed number
    const seed = `seed-${random}`; // Create a seed string

    fetch(`https://picsum.photos/seed/${seed}/200/300`) // Use the seed in the URL
      .then(() => {
        const containerEl = document.querySelector('#picture');

        const width = containerEl.offsetWidth;
        const height = containerEl.offsetHeight;

        // Generate the seeded API URL with container dimensions
        const apiUrl = `https://picsum.photos/seed/${seed}/${width}/${height}?grayscale`;
        setImageUrl(apiUrl); // Update the image source
      })
      .catch((error) => {
        console.error('Error fetching the image:', error);
      });
    fetch('https://quoteslate.vercel.app/api/quotes/random')
      .then((response) => response.json())
      .then((data) => {
        setQuote(data.quote);
        setQuoteAuthor(data.author);
      })
      .catch();
  }, []);

  return (
    <main className='about-main'>
      <div className='about-container'>
        <div id='picture' className='picture-box'>
          <img width='400px' src={imageUrl} alt='Nature Pic from picsum' />
        </div>

        <div className='content'>
          <section>
            <h2>Our Mission</h2>
            <p>
              Our application is designed to streamline inventory management and task coordination for teams.
              It helps you track resources, manage tasks, and improve collaboration in real-time with features
              like secure login, inventory tracking, available jobs, and a real-time chat for team collaboration.
            </p>
          </section>

          <section>
            <h2>The Team</h2>
            <ul className='team'>
              <li><strong>Carter Lee</strong> – Frontend Developer</li>
            </ul>
          </section>

          <section className='contact'>
            <h2>Contact Us</h2>
            <p>If you have any questions or suggestions, feel free to contact us at:</p>
            <p>
              <a href='mailto:support@inventoryapp.com'>support@inventoryapp.com</a>
            </p>
          </section>
        </div>
      </div>

      <div id='quote'>
        <h3>Quote of the Day</h3>
        <div>{quote}</div>
        <div>- {quoteAuthor}</div>
      </div>

  </main>
  );
}


