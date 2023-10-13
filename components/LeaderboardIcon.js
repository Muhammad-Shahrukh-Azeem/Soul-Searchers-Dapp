import React from 'react';

export default function LeaderboardIcon(props) {
  return (
    <img
      src="./leaderboard.png" 
      className="fill-white w-4 h-4 lg:w-4 lg:h-4" 
      id="Layer_1" 
      viewBox="0 0 24 24" 
      width="512" 
      height="512"
      {...props} // This allows you to pass other props to the SVG if needed
    >
    </img>
  );
}
