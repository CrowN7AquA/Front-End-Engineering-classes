import { useState } from "react";
import "./App.css";

const memes = [
  {
    image: "https://i.imgflip.com/1bij.jpg",
    title: "When the teacher says:",
    text: '"It\'s just a basic React project."',
  },
  {
    image: "https://i.imgflip.com/30b1gx.jpg",
    title: "Me after fixing one error:",
    text: '"I am basically a software engineer now."',
  },
  {
    image: "https://i.imgflip.com/1otk96.jpg",
    title: "When the code works:",
    text: '"I have no idea why, but DO NOT TOUCH IT."',
  },
  {
    image: "https://i.imgflip.com/1wz1x.jpg",
    title: "JavaScript be like:",
    text: '"Everything is an object." 💀',
  },
];

function Home() {
  const [meme] = useState(
    memes[Math.floor(Math.random() * memes.length)]
  );

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  function moveMeme() {
    setPosition({
      top: Math.random() * 100 - 50,
      left: Math.random() * 180 - 90,
    });
  }

  return (
    <main className="home">
      <div className="hero">
        <p className="small-text">WELCOME TO MY REACT PROJECT</p>

        <h1>Just a Normal Website 👀</h1>

        <p className="subtitle">
          Everything is normal here...
          <br />
          Except the meme.
        </p>

        <div
          className="meme-card"
          onMouseEnter={moveMeme}
          style={{
            transform: `translate(${position.left}px, ${position.top}px)`,
          }}
        >
          <img src={meme.image} alt="Meme" />

          <div className="meme-content">
            <h2>{meme.title}</h2>

            <p>{meme.text}</p>

            <div className="emojis">
              💀 💀 💀
            </div>

            <span className="catch">
              Click the meme to catch it 👇
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

function About() {
  return (
    <main className="about">
      <div className="about-card">
        <p className="small-text">ABOUT THIS PROJECT</p>

        <h1>About Me 💻</h1>

        <p className="about-text">
          This is a basic React project created to learn
          components, state and event handling.
        </p>

        <div className="features">
          <div className="feature">
            <span>⚛️</span>
            <h3>React</h3>
            <p>Used to build the user interface.</p>
          </div>

          <div className="feature">
            <span>🎨</span>
            <h3>CSS</h3>
            <p>Used to make the website look better.</p>
          </div>

          <div className="feature">
            <span>🧠</span>
            <h3>useState</h3>
            <p>Used to move the meme around.</p>
          </div>
        </div>

        <p className="ending">
          Basically... I made a meme that doesn't want to be
          clicked. 💀
        </p>
      </div>
    </main>
  );
}

function App() {
  const [page, setPage] = useState("home");

  return (
    <div>
      <nav>
        <div className="logo">
          <span>⚛</span>
          <h2>React.exe</h2>
        </div>

        <div className="nav-links">
          <button
            className={page === "home" ? "active" : ""}
            onClick={() => setPage("home")}
          >
            Home
          </button>

          <button
            className={page === "about" ? "active" : ""}
            onClick={() => setPage("about")}
          >
            About
          </button>
        </div>
      </nav>

      {page === "home" ? <Home /> : <About />}
    </div>
  );
}

export default App;