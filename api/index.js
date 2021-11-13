 const Bree = require('bree')
const bree = new Bree({jobs : [
      {
        name : 'app',
        path: updateHN,
        interval : '5m'
      }
    ]
  })
bree.start()

const {getLinkPreview} = require('link-preview-js')
const express = require('express')
const cors = require('cors')
const {loadHN, createOutput} = require('./lib');

const app = express()
const port = 8000

app.use(express.static(__dirname + '/public'))
app.use(cors())
app.set('view engine', 'hbs');
app.set('views', __dirname + '/templates');

let hnPosts_raw
let hnPosts_wData


app.get('/lp/', (req, res) => {
  let url = req.query.q
  let key = req.query.key
  if (url != null && url != '' && url != ' ') {
    getLinkPreview(url).then((data) =>
      res.json(data)
    );
  } else {
    res.send("Error")
  }
  
})

app.get('/hn/lp', async (req, res) => {
  res.json(hnPosts_wData)
})

app.get('/hn', async (req, res) => {
  res.json(hnPosts_raw)
})

app.get('/', async (req, res) => {
  res.render('index', {posts: hnPosts_wData})
})

async function updateHN() {
  hnPosts_raw = await loadHN();
  hnPosts_wData = await createOutput(hnPosts_raw);
}

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`)
  updateHN()
})
