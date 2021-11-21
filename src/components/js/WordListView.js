import DefinedWord from "./DefinedWord"

const WordListView = (props) => {
    const handleWordClick = (word) => {
        props.onClickWord(word);
    }
    return (
        <p>{props.words.map((element) => {
            return <DefinedWord word={element} displayPinyin={props.displayPinyin} onClick={handleWordClick} convertPinyin={props.convertPinyin}/>
        })}
        </p>
    )
}

export default WordListView;