import React from 'react'

const Vote = (props) => {
  let upvoteButton = ''
  let downVoteButton = ''
  let scoreColor

  let downvoteStyle = ''
  let upvoteStyle = ''
  if (props.currentAnnotation.did_vote) {
    if (props.currentAnnotation.direction === 1) {
      upvoteStyle = { color: '#22c13e' }
    } else if (props.currentAnnotation.direction === -1) {
      downvoteStyle = { color: 'red' }
    }
  }

  if (props.currentAnnotation.score === 0) {
    scoreColor = 'black'
  } else if (props.currentAnnotation.score < 0) {
    scoreColor = 'red'
  } else {
    scoreColor = '#22c13e'
  }

  const symbol = props.currentAnnotation.score > 0 ? '+' : ''
  const setStyle = (direction) => {
    if (direction === 'upvote') {
      upvoteStyle = { color: '#22c13e' }
      downvoteStyle = {}
    } else {
      downvoteStyle = { color: 'red' }
      upvoteStyle = {}
    }
  }

  if (props.currentUser) {
    downVoteButton = (<button onClick={() => { hanldeVote(downvote); setStyle('downvote') }}>
      <Icon type="down" style={downvoteStyle} />
                      </button>)
    upvoteButton = (<button onClick={() => { handleVote(upvote); setStyle('upvote') }}>
      <Icon type="up" style={upvoteStyle} />
                    </button>)

    let upvote = {
      user_id: props.currentUser.id,
      annotation_id: props.currentAnnotation.id,
      value: 1,
    }

    let downvote = {
      user_id: props.currentUser.id,
      annotation_id: props.currentAnnotation.id,
      value: -1,
    }

    const handleVote = (vote) => {
      props.updateAnnotation(props.currentAnnotation.id)
    }
  }

  return (
    <div className="voting">
      { downVoteButton }
      Upvote: <span style={{ color: scoreColor, marginLeft: '5px' }}>{symbol }{props.currentAnnotation.score}</span>
      { upvoteButton}
    </div>
  )
}

export default Vote
