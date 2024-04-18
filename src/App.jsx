import './App.css';
import { useState } from 'react';
import styled from 'styled-components';

const ListItem = styled.li`
  list-style-type: none;
  border: 1px solid #aaa;
  padding: 5px;
  margin-bottom: 10px;
`;
const List = styled.ol`
  border: 2px solid grey;
  padding: 15px;
  min-height: 450px;
  min-width: 200px;
`;

const Button = styled.button`
  padding: 0px;
  margin-left: 10px;
  min-width: 25px;
  min-height: 25px;
`
const AcceptButton = styled(Button)`
  background-color: darkgreen;
`
const DeclineButton = styled(Button)`
  background-color: darkred;
`

const Suggestion = ({ suggestion, acceptSuggestion, declineSuggestion }) => (
  <ListItem>
    {suggestion.title}
    <AcceptButton onClick={() => acceptSuggestion(suggestion)}
                  aria-label={`Accept ${suggestion.title}`}>✔</AcceptButton>
    <DeclineButton onClick={() => declineSuggestion(suggestion)}
                   aria-label={`Decline ${suggestion.title}`}>𝗫</DeclineButton>
  </ListItem>
);
const SuggestionsList = ({ suggestions, acceptSuggestion, declineSuggestion, setAnnouncement }) => (
  <List aria-label={`${suggestions.length} suggestions available`}>
    {suggestions.map(s =>
      <Suggestion
        suggestion={s}
        acceptSuggestion={acceptSuggestion}
        declineSuggestion={declineSuggestion}
        setAnnouncement={setAnnouncement}
        key={s.title}
      />)}
  </List>
);

const Tag = ({ tag, removeTag }) => (
  <ListItem>
    {tag.title}
    <DeclineButton onClick={() => removeTag(tag)}>𝗫</DeclineButton>
  </ListItem>
);
const TagsList = ({ tags, removeTag }) => (
  <List>
    {tags.map(t => <Tag tag={t} removeTag={removeTag} key={t.title}/>)}
  </List>
);

const Announcer = styled.ul`
  position: absolute;
  top: -9999px;
  left: -9999px;
`
const StyledApp = styled.div`
  display: flex;
  justify-content: space-evenly;
  min-width: 550px;
`

const generateSuggestions = (n) => [...Array(n)].map((s, i) => ({ title: `suggestion ${i + 1}` }));
const generateTags = (n) => [...Array(n)].map((s, i) => ({ title: `tag ${i + 1}` }));
const suggestionToTag = (s) => ({ title: `tag ${s.title.split(' ')[1]}` })

function App() {
  const [announcements, setAnnouncements] = useState([])
  const [suggestions, setSuggestions] = useState(generateSuggestions(9));
  const [tags, setTags] = useState(generateTags(0));

  const makeAnnouncement = (a) => setAnnouncements(() => [...announcements, a])
  const removeSuggestion = (s) => setSuggestions(suggestions.filter(t => s.title !== t.title));
  const removeTag = (t) => {
    makeAnnouncement(`${t.title} removed`)
    setTags(tags.filter(s => s.title !== t.title));
  }
  const acceptSuggestion = (s) => {
    makeAnnouncement(`${s.title} accepted`)
    setTags([...tags, suggestionToTag(s)])
    removeSuggestion(s)
  }
  const declineSuggeston = (s) => {
    makeAnnouncement(`${s.title} declined`)
    removeSuggestion(s)
  }

  return (
    <StyledApp>
      <Announcer aria-live="polite">
        {announcements.map((a) => <p key={a}>{a}</p>)}
      </Announcer>
      <TagsList tags={tags} removeTag={removeTag}/>
      <SuggestionsList
        suggestions={suggestions}
        acceptSuggestion={acceptSuggestion}
        declineSuggestion={declineSuggeston}
      />
    </StyledApp>);
}

export default App;
