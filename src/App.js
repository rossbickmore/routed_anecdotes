import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Route, Link, Redirect, withRouter
} from 'react-router-dom'
import { Table, Form, Button, Alert, Navbar} from 'react-bootstrap'
import { Container } from 'semantic-ui-react'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Link to="/" style={padding}>anecdotes</Link>
      <Link to="/create"  style={padding}>create new</Link>
      <Link to="/about"  style={padding}>about</Link>
    </Navbar>
  )
}

const AnecdoteList = ({ anecdotes, notification }) => (
  <div>
    <Notification notification={notification}/>
    <thead>
    <h4>Anecdotes</h4>
    </thead>
    <Table stripped>
    <tbody>
    {anecdotes.map(anecdote => <tr><th><Link to={"/anecdotes/"+anecdote.id} key={anecdote.id} >{anecdote.content}</Link></th><th>{anecdote.author}</th></tr>)}
    </tbody>
    </Table>
  </div>
)

const Anecdote = ({ anecdote }) => {
  console.log("anecdote",anecdote)
  return (
    <div>
      <h2>{anecdote.content}</h2>
      <p>has {anecdote.votes}</p>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/tkt21009'>Full Stack -sovelluskehitys</a>.

    See <a href='https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

let CreateNew = (props) => {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [info, setInfo] = useState('')
  console.log(content, author, info)

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content,
      author,
      info,
      votes: 0
    })
    props.history.push('/')
    props.createNotification(content)
    setTimeout(
      () => props.createNotification(""),
      10000
    );
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <Form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          author
          <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          url for more info
          <input name='info' value={info} onChange={(e) => setInfo(e.target.value)} />
        </div>
        <Button onClick={handleSubmit}>create</Button>
      </Form>
    </div>
  )

}

CreateNew = withRouter(CreateNew)

const Notification = (props) => {
  if (props.notification === "") {
    return (
      null
    )
  } else {
    return (
      <Alert variant="success"> 
        a new anecdote: {props.notification} created!
      </Alert>
    )
  }
}


const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1'
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2'
    }
  ])

  const [notification, setNotification] = useState("")

  const addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const createNotification = (content) => {
    setNotification(content)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <Container>
    <Router>
      <h1>Software anecdotes</h1>
      <Menu className="container"/>
      <Route exact path="/" render={() => <AnecdoteList anecdotes={anecdotes} notification={notification} />} className="container"/>
      <Route exact path="/anecdotes/:id" render={({ match }) =>
          <Anecdote anecdote={anecdoteById(match.params.id)}/>
        } />
      <Route exact path="/about" render={() => <About />} className="container"/>
      <Route exact path="/create" render={() => <CreateNew addNew={addNew} createNotification={createNotification} />} />
    </Router>
    <Footer />
    </Container>
  )
}

export default App;