import { useEffect, useState } from "react"

const App = () => {

    const [text, setText] = useState('');
    const [engText, setEngText] = useState('');
    const [words, setWords] = useState([]);
    const [selectedWord, setSelectedWord] = useState('');
    const [displayPinyin, setDisplayPinyin] = useState(true);

    const handleChange = (event) => {
        console.log("Change");
        setText(event.target.value);
    } 

    const handleCharacter = async (text, index) => {
        const char = text[index];
        const response = await fetch(`http://localhost:8000/character_lookup/${char}`);
        const json_response = await response.json();
        let longest_word_simplified = '';
        let longest_word_traditional = '';
        let longest_word_english = '';
        let longest_word_pinyin
        if (!(Symbol.iterator in Object(json_response)))
        {
            return
        }
        for (let word of json_response)
        {
            const simplified = word['simplified'];
            const traditional = word['traditional'];
            const english = word['english'];
            const pinyin = word['pinyin'];
            let has_finished = true;
            for (let i = 0; i < word['simplified'].length; i++)
            {
                if (!(text[index + i] === simplified[i] || text[index + i] === traditional[i]))
                {
                    has_finished = false;
                    break;
                }
            }
            if (has_finished)
            {
                if (simplified.length > longest_word_simplified.length)
                {
                    longest_word_english = english;
                    longest_word_simplified = simplified
                    longest_word_traditional = traditional
                    longest_word_pinyin = pinyin
                }
            }
        }
        return [longest_word_simplified, longest_word_traditional, longest_word_english, longest_word_pinyin];
    }

    const handleSubmit = async (event) => {
        const characters = text.split('');
        setWords([]);
        for (let i = 0; i < characters.length; i++) {
            const definition = await handleCharacter(characters, i);
            if (!definition)
            {
                continue;
            }
            const [simplified, traditional, english, pinyin] = definition;
            if (english)
            {                
                setWords(words => [...words, {simplified, traditional, english, pinyin}])
                i += simplified.length - 1;
            }
        }

    }

    const handleClickWord = (obj) => {
        setSelectedWord(obj);
    }

    const handlePinyinCheck = (event) => {
        console.log(displayPinyin);
        console.log(event.target.checked);
        setDisplayPinyin(event.target.checked);
    }

    return (
        <div>
            <div>
                <textarea onChange={handleChange} style={{width: '100%'}}>
                </textarea>
            </div>
            <div>
                <button onClick={handleSubmit}>Submit</button>
                <input type="checkbox" checked={displayPinyin} onChange={handlePinyinCheck}/>
            </div>
            <div>
                <p>{words.map((element) => {
                    if (displayPinyin)
                    {
                        return (<ruby className="word" onClick={() => handleClickWord(element)}>{element.simplified}<rp>(</rp><rt>{element.pinyin}</rt><rp>)</rp></ruby>)
                    } else {
                        return (<span className="word" onClick={() => handleClickWord(element)}>{element.simplified}</span>)
                    }
                })}
                </p>
                <br></br>
                {selectedWord && 
                <div>
                    <ruby className="definition-header">{selectedWord.simplified}<rp>(</rp><rt>{selectedWord.pinyin}</rt><rp>)</rp></ruby>
                    <span className="definition-body">{selectedWord.english}</span>
                </div>
                }
            </div>
        </div>
    )
}

export default App;