const express= require("express")

const axios= require("axios")
const cors= require("cors")
const Redis= require("redis")

const redisClient= Redis.createClient(
     {url: 'redis://localhost:6379'}
);

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
  });
  
  // Connect the client
  redisClient.connect().then(() => {
    console.log('Connected to Redis');
  }).catch(err => {
    console.error('Failed to connect to Redis', err);
  });
  
const DEFAULT_EXPIRATION=3600;

    
const app=express()
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.get('/photos', async (req, res) => {
    console.log('api hit');
    const albumId = req.query.albumId;

    try {
        const photos = await redisClient.get('photos');
        console.log('hello');
        if (photos != null) {
            console.log('cache hit');
            return res.json(JSON.parse(photos));
        } else {
            const { data } = await axios.get('https://jsonplaceholder.typicode.com/photos', { params: { albumId } });
            await redisClient.setEx('photos', DEFAULT_EXPIRATION, JSON.stringify(data));
            res.json(data);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

app.get("/photos/:id", async(req, res)=>{
    console.log("api hit id")
    try {
        const photo = await redisClient.get(`photos:${req.params.id}`);
        console.log('hello');
        if (photo != null) {
            console.log('cache hit id');
            return res.json(JSON.parse(photo));
        } else {
            console.log("cache miss id")
            const { data } = await axios.get(`https://jsonplaceholder.typicode.com/photos/${req.params.id}`);
            await redisClient.setEx(`photos:${req.params.id}`, DEFAULT_EXPIRATION, JSON.stringify(data));
            res.json(data);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
})




app.listen(4000, ()=>{
    console.log("Server is running on port 4000")
})
