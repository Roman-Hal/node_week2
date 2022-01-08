const express = require('express');
const app = express();

const albumsData = [
    {
      albumId: "10",
      artistName: "Beyoncé",
      collectionName: "Lemonade",
      artworkUrl100:
        "http://is1.mzstatic.com/image/thumb/Music20/v4/23/c1/9e/23c19e53-783f-ae47-7212-03cc9998bd84/source/100x100bb.jpg",
      releaseDate: "2016-04-25T07:00:00Z",
      primaryGenreName: "Pop",
      url: "https://www.youtube.com/embed/PeonBmeFR8o?rel=0&amp;controls=0&amp;showinfo=0",
    },
    {
      albumId: "11",
      artistName: "Beyoncé",
      collectionName: "Dangerously In Love",
      artworkUrl100:
        "http://is1.mzstatic.com/image/thumb/Music/v4/18/93/6d/18936d85-8f6b-7597-87ef-62c4c5211298/source/100x100bb.jpg",
      releaseDate: "2003-06-24T07:00:00Z",
      primaryGenreName: "Pop",
      url: "https://www.youtube.com/embed/ViwtNLUqkMY?rel=0&amp;controls=0&amp;showinfo=0",
    },
  ];

  app.use(express.json());

  //let nextId = albumsData.length;
  let nextId = 13;
  
  app.get("/albums", function (req, res) {
    res.send(albumsData);
  });

  app.get("/", (req, res) => {
    res.send({message: "Successful connection"});
  });

  app.get("/albums/:albumId", (req, res) => {
    //console.log(req.params.albumId);
    const findAlbum = albumsData.find(album => album.albumId === req.params.albumId);
    if (findAlbum) {
    res.send(findAlbum);
    } else {
        res.status(404).send({message: "data not found"});
    }
  });

  

  app.post("/albums", (req, res) => {
    const newAlbum = {
        albumId: ""+nextId,
        artistName: req.body.artistName,
        collectionName: req.body.collectionName,
        artworkUrl100: req.body.artworkUrl100,
        releaseDate: req.body.releaseDate,
        primaryGenreName: req.body.primaryGenreName,
        url: req.body.url
    }

    if (albumsData.find(album => album.albumId === newAlbum.albumId || album.url === newAlbum.url)){
        res.status(400).send({message: "Album already exists!"});
    } else if (!newAlbum.artistName || !newAlbum.collectionName || !newAlbum.artworkUrl100 || !newAlbum.releaseDate || !newAlbum.primaryGenreName || !newAlbum.url) {
        res.status(400).send({message: "Data missing"});
    } else {
        albumsData.push(newAlbum);
        nextId++;
        res.status(201).send(newAlbum);
    }
  });

  app.delete("/albums/:albumId", (req, res) => {
      const albumId = req.params.albumId;
      const positionAlbum = albumsData.find(album => album.albumId === albumId);
      albumsData.splice(positionAlbum, 1);
      res.status(200).send({message: "Success"});
  });

  app.put("/albums/:albumID", (req, res) => {
    /*let newAlbum = {
      albumId: req.body.albumId,
      artistName: req.body.artistName,
      collectionName: req.body.collectionName
    }*/

    let newAlbum = {};
    const {albumId, artistName, collectionName} = req.body;
    if (albumId !== albumsData.albumId){
      res.status(400).json({ message: `You can not change id`});
    } 
    albumsData.forEach((album, index) => {
      if(album.albumId == parseInt(req.params.albumID)) {
        newAlbum = { ...album, artistName, collectionName };
        albumsData[index] = newAlbum;
        
      }
    });

    
    if (newAlbum === {}) {
      res
        .status(400)
        .json({ msg: "No album with this id was found", success: false });
    };
    res.status(200).send({
      success: true,
      newAlbum: newAlbum,
    });
  });



  const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));