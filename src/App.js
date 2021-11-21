import { useState } from "react"
import ExpandedDefinition from "./components/js/ExpandedDefinition";
import WordListView from "./components/js/WordListView";
import { Word as WordModel } from "./datamodels";

const App = () => {

    const [text, setText] = useState('');
    const [words, setWords] = useState([]);
    const [selectedWord, setSelectedWord] = useState('');
    const [displayPinyin, setDisplayPinyin] = useState(true);
    const [convertPinyin, setConvertPinyin] = useState(true);
    const [percentComplete, setPercentComplete] = useState(0);

    const handleChange = (event) => {
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
        return new WordModel(longest_word_simplified, longest_word_traditional, longest_word_english, longest_word_pinyin);
    }

    const handleSubmit = async (event) => {
        const characters = text.split('');
        setWords([]);
        const newWords = [];
        for (let i = 0; i < characters.length; i++) {
            const word = await handleCharacter(characters, i);
            if (!word)
            {
                continue;
            }
            if (word.english)
            {         
                newWords.push(word)
                i += word.simplified.length - 1;
                setPercentComplete(i/characters.length);
            }
        }
        setWords(newWords);

    }

    const handleClickWord = (word) => {
        console.log(word);
        setSelectedWord(word);
    }

    const handlePinyinCheck = (event) => {
        setDisplayPinyin(event.target.checked);
    }

    const handleConvertCheck = (event) => {
        setConvertPinyin(event.target.checked);
    }    

    return (
        <div>
            <div className="row">
                <h1>Enter Text:</h1>
            </div>
            <div className="row">
                <textarea onChange={handleChange} style={{width: '100%'}}>
                </textarea>
            </div>
            <div className="row">
                <button onClick={handleSubmit}>Submit</button>
                <input id="pinyinCheckbox" type="checkbox" checked={displayPinyin} onChange={handlePinyinCheck}/>
                <label for="pinyinCheckbox">Display Pinyin</label>
                <input id="convertCheckbox" type="checkbox" checked={convertPinyin} onChange={handleConvertCheck}/>
                <label for="convertCheckbox">Covert Pinyin (pin1yin1 -> pinyin)</label>
            </div>
            <div className="row">
                <div class="word-list-column">
                    {words.length > 0 ? <WordListView words={words} displayPinyin={displayPinyin} onClickWord={handleClickWord} convertPinyin={convertPinyin}/> : percentComplete > 0 && <h1>{Math.floor(percentComplete)}%</h1>}
                </div>
                <div class="expanded-definition-column">
                    {selectedWord && <ExpandedDefinition word={selectedWord} convertPinyin={convertPinyin}/>}
                </div>
            </div>
        </div>
    )
}

export default App;