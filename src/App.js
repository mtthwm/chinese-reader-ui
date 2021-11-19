import { useEffect, useState } from "react"

const App = () => {

    const [text, setText] = useState('');
    const [engText, setEngText] = useState('');

    const handleChange = (event) => {
        console.log("Change");
        setText(event.target.value);
    } 

    const handleCharacter = async (text, index) => {
        const char = text.charAt(index);
        const response = await fetch(`http://localhost:8000/character_lookup/${char}`);
        const json_response = await response.json();
        if (json_response.length > 0)
        {
            const english = json_response[0].english;
            return english;
        } 
    }

    const handleSubmit = async (event) => {
        const characters = text.split('');
        setEngText('');
        for (let i = 0; i < characters.length; i++) {
            const english = await handleCharacter(characters, i);
            if (english)
            {
                
                console.log(engText + " " + english)
                const newTranslation = engText + english;
                console.log(newTranslation);
                setEngText(engText => engText + " | " + english);
            }
        }

    }

    return (
        <div>
            <div>
                <textarea onChange={handleChange} style={{width: '100%'}}>
                </textarea>
            </div>
            <div>
                <button onClick={handleSubmit}>Submit</button>
            </div>
            <div>
                <p>{engText}</p>
            </div>
        </div>
    )
}

export default App;