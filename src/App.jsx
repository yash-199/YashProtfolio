import React from 'react'
import Home from './page/Home'
import Snowfall from 'react-snowfall'
const App = () => {
    return (
        <div>
            <Snowfall
                // Changes the snowflake color
                color="white"
                // Applied to the canvas element
                style={{ background: '#000'}}
                // Controls the number of snowflakes that are created (default 150)
                snowflakeCount={500}
            />
            <Home />
        </div>
    )
}

export default App
