import React from 'react';
import './about.css';

export function About(props) {
  const [imageUrl, setImageUrl] = React.useState('');
  const [quote, setQuote] = React.useState('');
  const [quoteAuthor, setQuoteAuthor] = React.useState('');

  // Only runs on the initial render
  React.useEffect(() => {
    setImageUrl(`Hawaii.jpg`);
    setQuote('Show me the code');
    setQuoteAuthor('Linus Torvalds');
  }, []);

  return (
    <main className='about-main'>
      <div className='about-container'>
        <div id='picture' className='picture-box'>
          <img width='400px' src={imageUrl} alt='Hawaii' />
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


