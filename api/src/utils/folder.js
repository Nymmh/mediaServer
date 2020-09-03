let fs = require("fs"),
    ffprobe = require('ffprobe'),
    ffprobeStatic = require('ffprobe-static'),
    extractFrame = require('ffmpeg-extract-frame'),
    path = require('path'),
    request = require('request'),
    anitomy = require('anitomyscript'),
    Eris = require('eris'),
    {updatedEpisode} = require('../resolver');


const {Animes,Titles,Images,Links,StartDate,EndDate,OffSiteScores,EpisodeLists} = require("../models/content");
exports.uwu = (directory)=>{
    uwu(directory)
}
function uwu(directory){
    //readthis = 'i:/anime';
    //readthis = 'C:/Users/Nymh/Downloads/Video';
    readthis = directory;
    fs.readdir(readthis,(err,files)=>{
        for(let names of files){
            //readthis = 'C:/Users/Nymh/Downloads/Video';
            readthis = directory;
            savedir = readthis;
            readthis = `${readthis}/${names}`;
            saveRead = readthis;
            let stat = fs.lstatSync(readthis);
            if(stat.isDirectory()){
                savedir = `${savedir}/${names}`;
            }
            readfolder2(readthis,saveRead,savedir);
        }
    });
}

function findlostItem(readthis, saveRead, savedir){
    try{
        let stat = fs.lstatSync(savedir);
        if(stat.isDirectory()){
            fs.readdir(savedir,(err,files)=>{
                for(let nest of files){
                    readthis = saveRead;
                    readthis = `${readthis}/${nest}`;
                    try{
                        let stat = fs.lstatSync(readthis);
                        if(stat.isDirectory()){
                            readfolder2(readthis,saveRead, savedir);
                        }else{
                            readItem(readthis, saveRead, savedir);
                        }
                    }catch(e){}
                }
            });
        }else readItem(readthis, saveRead, savedir);
    }catch(e){return false}
}
function resetEpisodes(readthis, saveRead, savedir, files){
    readthis = saveRead;
    if(files)if(files[0])delete files[0];
    for(let episodesdown in files){
        if(files[episodesdown]){
            //console.log(files[episodesdown]);
            readthis = `${saveRead}/${files[episodesdown]}`;
            readItem(readthis, saveRead, savedir);
        }
    }
}
function readfolder2(readthis, saveRead, savedir){
    try{
        var nestarray = [];
        let stat = fs.lstatSync(readthis); 
        if(stat.isDirectory()){
            fs.readdir(readthis,(err,files)=>{
                //files returns array
                for(let nest of files){
                    //we thing animeid.txt is always gonna be in slot 0 so we use 0,1
                    readthis = saveRead;
                    readthis = `${readthis}/${nest}`;
                    try{
                        let stat = fs.lstatSync(readthis);
                        if(stat.isDirectory()){
                            readfolder(readthis,saveRead, savedir);
                        }else{
                            //readItem(readthis, saveRead, savedir,nestarray);
                        }
                    }catch(e){}
                }
                if(files.length == 1){
                    readItem(readthis, saveRead, savedir);
                }else{
                    readthis = `${readthis}/${files[0]}`;
                    //findlostItem(readthis, saveRead, savedir);
                }
                if(files.length>1){
                    //now we assume the file is a nest :/
                    if(files[0].endsWith('.txt')){
                        files.splice(0,1);
                    }
                    if(files.length>1){
                        //console.log(files)
                        readthis = `${saveRead}/${files[0]}`;
                        readItem(readthis, saveRead, savedir,true,files);
                    }else{
                        readthis = `${saveRead}/${files[0]}`;
                        readItem(readthis, saveRead, savedir);
                    }
                }else{
                    readItem(readthis, saveRead, savedir);
                }
            });
        }else readItem(readthis, saveRead, savedir);
    }catch(e){return false}
}

function readfolder(readthis, saveRead, savedir){
    try{
        let stat = fs.lstatSync(readthis);
        if(stat.isDirectory()){
            fs.readdir(readthis,(err,files)=>{
                for(let nest of files){
                    readthis = saveRead;
                    readthis = `${readthis}/${nest}`;
                    try{
                        let stat = fs.lstatSync(readthis);
                        if(stat.isDirectory()){
                            setTimeout(readfolder(readthis,saveRead, savedir),3500);
                        }else{
                            setTimeout(readItem(readthis, savedir),3500);
                        }
                    }catch(e){}
                }
            });
        }else readItem(readthis, savedir);
    }catch(e){return false}
}


function readItem(readthis, saveRead, savedir,returnitem,files){
    if(readthis.endsWith(".ini")){console.log("ini")}else{
        if(readthis.endsWith(".mp4") || readthis.endsWith(".mkv") || readthis.endsWith(".avi")){
            ffprobe(readthis,{path: ffprobeStatic.path},(err,info)=>{
                if(!info)console.log(err)
                for(let streams in info.streams){
                    let data = info.streams[streams];
                    if(data.codec_type == "video"){
                        var fileName = path.basename(readthis).replace('.mp4','').replace('.mkv.mkv','').replace('.mkv','').replace('.avi','');
                        var mkvtest = false;
                        if(readthis.endsWith(".mkv")){
                            mkvtest = true;
                        }else{
                            mkvtest = false;
                        }
                        var codec = data.codec_name,
                            width = data.width,
                            height = data.height,
                            aspect_ratio = data.aspect_ratio,
                            frameRate = data.r_frame_rate.split('/'),
                            frameRateMath = (frameRate[0]/frameRate[1]).toFixed(2);
                        if(data.tags){
                            var duration = data.tags.DURATION;
                        }
                        let item = fs.statSync(readthis);
                        let sizeMB = (item.size / 1048576).toFixed(2);
                        // console.log(readthis);
                        // console.log(sizeMB);
                        // console.log(path.extname(readthis));
                        anitomy(fileName).then((anires)=>{
                            var episode_number = "0";
                            let anime_title = anires.anime_title,
                                anime_type = anires.anime_type,
                                audio_term = anires.audio_term,
                                episode_prefix = anires.episode_prefix,
                                episode_title = anires.episode_title,
                                release_group = anires.release_group,
                                anime_source = anires.source,
                                video_resolution = anires.video_resolution,
                                video_term = anires.video_term;
                                if(anires.episode_number)episode_number = anires.episode_number;
                                if(typeof audio_term == 'object')audio_term = anires.audio_term[0];
                            //console.log(res)
                            var bdtest = false;
                            if(anime_source == "BDrip")bdtest = true;
                            console.log(anime_title)
                            Titles.findOne({romaji:anime_title},(err,romajiRes)=>{
                                console.log(anime_title);
                                if(romajiRes){
                                    //if anime is found
                                    let mainID = romajiRes.parent;
                                    EpisodeLists.findOne({parent:mainID,episode:episode_number},(err,res)=>{
                                        if(!res){
                                            //if ep not found
                                            extractFrame({
                                                input: readthis,
                                                output: __dirname+"/thumbnails/"+fileName+'.jpg',
                                                offset: Math.floor(Math.random()*240000)+50000,
                                                quality: 30
                                            }).then(()=>{
                                                options = {
                                                    method: 'POST',
                                                    url: "https://www.catgirls.forsale/api/upload",
                                                    headers: {
                                                        'Content-Type': 'multipart/form-data'
                                                    },
                                                    formData : {
                                                        "key": 'lhrfmdcp49ni05w12xtkb7sjozgqvelhr8fmdcp49n35w12xtkb7souzgvaerfwt',
                                                        "nolewd" : fs.createReadStream(__dirname+"/thumbnails/"+fileName+".jpg"),
                                                        "animesup":"localanime"
                                                    }
                                                }
                                                request(options, function (error, response, imgbody){
                                                    uploadedImage = imgbody;
                                                    console.log(uploadedImage);
                                                    fs.unlink(__dirname+"/thumbnails/"+fileName+".jpg",(err)=>{
                                                        if(err){throw new Error(err)}
                                                        let newEpisode = new EpisodeLists({
                                                            parent:romajiRes.parent,
                                                            title:episode_title,
                                                            length:duration,
                                                            thumbnail:uploadedImage,
                                                            stream:readthis.replace('C:/xampp/htdocs','http://localhost'),
                                                            episode:episode_number,
                                                            dualAudio:false,
                                                            subsBy:release_group,
                                                            ismkv:mkvtest,
                                                            BDrip:bdtest,
                                                            resolution:video_resolution,
                                                            codec:codec,
                                                            aspectRatio:aspect_ratio,
                                                            frameRate:frameRateMath,
                                                            audioTerm:audio_term
                                                        });
                                                        //new episode updated
                                                        newEpisode.save().then(
                                                            (rree)=>{
                                                                console.log("output for updated episode")
                                                                console.log(rree)
                                                            });
                                                        let currentTime = new Date().getTime();
                                                        Animes.findOneAndUpdate({_id:romajiRes.parent},{
                                                            updatedat:currentTime
                                                        },{new:true},err=>{if(err)console.log(err)})
                                                    });
                                                });
                                            });
                                        }else{
                                            console.log(`${anime_title} episode ${episode_number} already exists in the database`)
                                        }
                                    });
                                }else{
                                    Titles.findOne({filetitle:anime_title},(err,filetitleRes)=>{
                                    if(filetitleRes){
                                    //if anime is found
                                    let mainID = filetitleRes.parent;
                                    EpisodeLists.findOne({parent:mainID,episode:episode_number},(err,res)=>{
                                        if(!res){
                                            //if ep not found
                                            extractFrame({
                                                input: readthis,
                                                output: __dirname+"/thumbnails/"+fileName+'.jpg',
                                                offset: Math.floor(Math.random()*240000)+50000,
                                                quality: 20
                                            }).then(()=>{
                                                options = {
                                                    method: 'POST',
                                                    url: "https://www.catgirls.forsale/api/upload",
                                                    headers: {
                                                        'Content-Type': 'multipart/form-data'
                                                    },
                                                    formData : {
                                                        "key": 'lhrfmdcp49ni05w12xtkb7sjozgqvelhr8fmdcp49n35w12xtkb7souzgvaerfwt',
                                                        "nolewd" : fs.createReadStream(__dirname+"/thumbnails/"+fileName+".jpg"),
                                                        "animesup":"localanime"
                                                    }
                                                }
                                                request(options, function (error, response, imgbody){
                                                    uploadedImage = imgbody;
                                                    console.log(uploadedImage);
                                                    fs.unlink(__dirname+"/thumbnails/"+fileName+".jpg",(err)=>{
                                                        if(err){throw new Error(err)}
                                                        let newEpisode = new EpisodeLists({
                                                            parent:filetitleRes.parent,
                                                            title:episode_title,
                                                            length:duration,
                                                            thumbnail:uploadedImage,
                                                            stream:readthis.replace('C:/xampp/htdocs','http://localhost'),
                                                            episode:episode_number,
                                                            dualAudio:false,
                                                            subsBy:release_group,
                                                            ismkv:mkvtest,
                                                            BDrip:bdtest,
                                                            resolution:video_resolution,
                                                            codec:codec,
                                                            aspectRatio:aspect_ratio,
                                                            frameRate:frameRateMath,
                                                            audioTerm:audio_term
                                                        });
                                                        newEpisode.save().then((rree)=>{console.log(rree)});
                                                        let currentTime = new Date().getTime();
                                                        Animes.findOneAndUpdate({_id:filetitleRes.parent},{
                                                            updatedat:currentTime
                                                        },{new:true},err=>{if(err)console.log(err)})
                                                    });
                                                });
                                            });
                                        }else{
                                            console.log(`${anime_title} episode ${episode_number} already exists in the database`)
                                        }
                                    });
                                        }else{
                                            Titles.findOne({english:anime_title},(err,enmglishRes)=>{
                                                if(enmglishRes){
                                                    //if anime is found
                                                    let mainID = enmglishRes._id;
                                                    EpisodeLists.findOne({parent:mainID,episode:episode_number},(err,res)=>{
                                                        if(!res){
                                                            //if episode is not found
                                                            extractFrame({
                                                                input: readthis,
                                                                output: __dirname+"/thumbnails/"+fileName+'.jpg',
                                                                offset: Math.floor(Math.random()*240000)+50000,
                                                                quality: 20
                                                            }).then(()=>{
                                                                options = {
                                                                    method: 'POST',
                                                                    url: "https://www.catgirls.forsale/api/upload",
                                                                    headers: {
                                                                        'Content-Type': 'multipart/form-data'
                                                                    },
                                                                    formData : {
                                                                        "key": 'lhrfmdcp49ni05w12xtkb7sjozgqvelhr8fmdcp49n35w12xtkb7souzgvaerfwt',
                                                                        "nolewd" : fs.createReadStream(__dirname+"/thumbnails/"+fileName+".jpg"),
                                                                        "animesup":"localanime"
                                                                    }
                                                                }
                                                                request(options, function (error, response, imgbody){
                                                                    uploadedImage = imgbody;
                                                                    console.log(uploadedImage);
                                                                    fs.unlink(__dirname+"/thumbnails/"+fileName+".jpg",(err)=>{
                                                                        if(err){throw new Error(err)}
                                                                        let newEpisode = new EpisodeLists({
                                                                            parent:enmglishRes.parent,
                                                                            title:episode_title,
                                                                            length:duration,
                                                                            thumbnail:uploadedImage,
                                                                            stream:readthis.replace('C:/xampp/htdocs','http://localhost'),
                                                                            episode:episode_number,
                                                                            dualAudio:false,
                                                                            subsBy:release_group,
                                                                            ismkv:mkvtest,
                                                                            BDrip:bdtest,
                                                                            resolution:video_resolution,
                                                                            codec:codec,
                                                                            aspectRatio:aspect_ratio,
                                                                            frameRate:frameRateMath,
                                                                            audioTerm:audio_term
                                                                        });
                                                                        newEpisode.save().then((rree)=>{console.log(rree)});
                                                                        let currentTime = new Date().getTime();
                                                                        Animes.findOneAndUpdate({_id:enmglishRes.parent},{
                                                                            updatedat:currentTime
                                                                        },{new:true},err=>{if(err)console.log(err)})
                                                                    });
                                                                });
                                                            });
                                                        }else{
                                                            console.log(`${anime_title} episode ${episode_number} already exists in the database`)
                                                        }
                                                    });
                                                }else{
                                                    //anime not found
                                                    console.log(anime_title);
                                                    Animes.findOne({},{},{limit:1,sort:{'id':-1}},(err,res)=>{
                                                        var lastid = res.id;
                                                        var newid = Number(lastid)+1;
                                                        let newAnime = new Animes({id:newid});
                                                        newAnime.save().then((saveres)=>{
                                                            var savedID = saveres._id;
                                                            let newEndDate = new EndDate({parent:savedID});
                                                            newEndDate.save().then((endDateRes)=>{
                                                                var savedEndDate = endDateRes._id;
                                                                let newEpisodeLists = new EpisodeLists({parent:savedID});
                                                                newEpisodeLists.save().then((episodesListRes)=>{
                                                                    var savedEpisodesList = episodesListRes._id;
                                                                    let newImages = new Images({parent:savedID});
                                                                    newImages.save().then((imagesRes)=>{
                                                                        var savedImagesRes = imagesRes._id;
                                                                        let newLinks = new Links({parent:savedID});
                                                                        newLinks.save().then((linksRes)=>{
                                                                            var savedLinksRes = linksRes._id;
                                                                            let newOffsitescores = new OffSiteScores({parent:savedID});
                                                                            newOffsitescores.save().then((offsitescoresRes)=>{
                                                                                var savedOffsirescoresRes = offsitescoresRes._id;
                                                                                let newStartdates = new StartDate({parent:savedID});
                                                                                newStartdates.save().then((startdatesRes)=>{
                                                                                    var savedStartDates = startdatesRes._id;
                                                                                    let newTitles = new Titles({parent:savedID});
                                                                                    newTitles.save().then((titlesRes)=>{
                                                                                        var savedtitlesRes = titlesRes._id;
                                                                                        if(fs.existsSync(`${savedir}/animeid.txt`)){
                                                                                            fs.readFile(`${savedir}/animeid.txt`,'utf8',(err,data)=>{
                                                                                                console.log("found id file");
                                                                                                    var animeidnum = Number(data);
                                                                                                    query = `
                                                                                                    query($animeid:Int){
                                                                                                        Media(id:$animeid type:ANIME){
                                                                                                            id
                                                                                                            idMal
                                                                                                            episodes
                                                                                                            duration
                                                                                                            format
                                                                                                            source
                                                                                                            status
                                                                                                            season
                                                                                                            description(asHtml:true)
                                                                                                            synonyms
                                                                                                            endDate {
                                                                                                                year
                                                                                                                month
                                                                                                                day
                                                                                                            }
                                                                                                            startDate {
                                                                                                                year
                                                                                                                month
                                                                                                                day
                                                                                                            }
                                                                                                            coverImage {
                                                                                                                large
                                                                                                            }
                                                                                                            bannerImage
                                                                                                            averageScore
                                                                                                            meanScore
                                                                                                            popularity
                                                                                                            favourites
                                                                                                            title {
                                                                                                                romaji
                                                                                                                english
                                                                                                                native
                                                                                                            }
                                                                                                            }
                                                                                                        }
                                                                                                        `;
                                                                                                    variables = {
                                                                                                        animeid: animeidnum
                                                                                                    }
                                                                                                    url="https://graphql.anilist.co";
                                                                                                    options = {
                                                                                                        method: 'POST',
                                                                                                        headers: {
                                                                                                            'Content-Type': 'application/json',
                                                                                                            'Accept': 'application/json',
                                                                                                        },
                                                                                                        body: JSON.stringify({
                                                                                                            query: query,
                                                                                                            variables: variables
                                                                                                        })
                                                                                                    };
                                                                                                    request(url, options, function (error, response, body){
                                                                                                        var ALbody = JSON.parse(body);
                                                                                                        extractFrame({
                                                                                                            input: readthis,
                                                                                                            output: __dirname+"/thumbnails/"+fileName+'.jpg',
                                                                                                            offset: Math.floor(Math.random()*240000)+50000,
                                                                                                            quality: 20
                                                                                                        }).then(()=>{
                                                                                                            options = {
                                                                                                                method: 'POST',
                                                                                                                url: "https://www.catgirls.forsale/api/upload",
                                                                                                                headers: {
                                                                                                                    'Content-Type': 'multipart/form-data'
                                                                                                                },
                                                                                                                formData : {
                                                                                                                    "key": 'lhrfmdcp49ni05w12xtkb7sjozgqvelhr8fmdcp49n35w12xtkb7souzgvaerfwt',
                                                                                                                    "nolewd" : fs.createReadStream(__dirname+"/thumbnails/"+fileName+".jpg"),
                                                                                                                    "animesup":"localanime"
                                                                                                                }
                                                                                                            }
                                                                                                            request(options, function (error, response, imgbody){
                                                                                                                uploadedImage = imgbody;
                                                                                                                console.log(uploadedImage);
                                                                                                                fs.unlink(__dirname+"/thumbnails/"+fileName+".jpg",(err)=>{
                                                                                                                    if(err){throw new Error(err)}
                                                                                                                    let synonyms = "";
                                                                                                                    // for(let syn in media.synonyms){
                                                                                                                    //     synonyms += media.synonyms[syn]+", ";
                                                                                                                    // }
                                                                                                                    var media = ALbody.data.Media;
                                                                                                                    var alID = media.id,
                                                                                                                        malID = media.idMal,
                                                                                                                        episodes = media.episodes,
                                                                                                                        duration = media.duration,
                                                                                                                        format = media.format,
                                                                                                                        source = media.source,
                                                                                                                        status = media.status,
                                                                                                                        season = media.season,
                                                                                                                        description = media.description,
                                                                                                                        endDateYear = media.endDate.year,
                                                                                                                        endDateMonth = media.endDate.month,
                                                                                                                        endDateDay = media.endDate.day,
                                                                                                                        startDateYear = media.startDate.year,
                                                                                                                        startDateMonth = media.startDate.month,
                                                                                                                        startDateDay = media.startDate.day,
                                                                                                                        coverImg = media.coverImage.large,
                                                                                                                        banner = media.bannerImage,
                                                                                                                        averageScore = media.averageScore,
                                                                                                                        meanScore = media.meanScore,
                                                                                                                        popularity = media.popularity,
                                                                                                                        favourites = media.favourites,
                                                                                                                        titleRomaji = media.title.romaji,
                                                                                                                        titleEnglish = media.title.english,
                                                                                                                        titleNative = media.title.native;
                                                                                                                        Animes.findOneAndUpdate({_id:savedID},{
                                                                                                                            episodes:episodes,
                                                                                                                            duration:duration,
                                                                                                                            format:format,
                                                                                                                            source:source,
                                                                                                                            status:status,
                                                                                                                            season:season,
                                                                                                                            description:description,
                                                                                                                            synonyms:synonyms
                                                                                                                        },{new:true},err=>{if(err)throw new Error(err)}).then((res)=>{console.log(res)});
                                                                                                                        Titles.findOneAndUpdate({_id:savedtitlesRes},{
                                                                                                                            romaji:titleRomaji,
                                                                                                                            english:titleEnglish,
                                                                                                                            native:titleNative,
                                                                                                                            filetitle:anime_title
                                                                                                                        },{new:true},err=>{if(err)throw new Error(err)}).then((res)=>{console.log(res)});
                                                                                                                        Images.findOneAndUpdate({_id:savedImagesRes},{
                                                                                                                            cover:coverImg,
                                                                                                                            banner:banner
                                                                                                                        },{new:true},err=>{if(err)throw new Error(err)}).then((res)=>{console.log(res)});
                                                                                                                        Links.findOneAndUpdate({_id:savedLinksRes},{
                                                                                                                            idAL:alID,
                                                                                                                            idMAL:malID
                                                                                                                        },{new:true},err=>{if(err)throw new Error(err)}).then((res)=>{console.log(res)});
                                                                                                                        StartDate.findOneAndUpdate({_id:savedStartDates},{
                                                                                                                            startYear:startDateYear,
                                                                                                                            startMonth:startDateMonth,
                                                                                                                            startDay:startDateDay
                                                                                                                        },{new:true},err=>{if(err)throw new Error(err)}).then((res)=>{console.log(res)});
                                                                                                                        EndDate.findOneAndUpdate({_id:savedEndDate},{
                                                                                                                            endYear:endDateYear,
                                                                                                                            endMonth:endDateMonth,
                                                                                                                            endDay:endDateDay
                                                                                                                        },{new:true},err=>{if(err)throw new Error(err)}).then((res)=>{console.log(res)});
                                                                                                                        OffSiteScores.findOneAndUpdate({_id:savedOffsirescoresRes},{
                                                                                                                            alAverage:averageScore,
                                                                                                                            alMean:meanScore,
                                                                                                                            alPopularity:popularity,
                                                                                                                            alFavourites:favourites
                                                                                                                        },{new:true},err=>{if(err)throw new Error(err)}).then((res)=>{console.log(res)});
                                                                                                                        EpisodeLists.findOneAndUpdate({_id:savedEpisodesList},{
                                                                                                                            title:episode_title,
                                                                                                                            length:duration,
                                                                                                                            thumbnail:uploadedImage,
                                                                                                                            stream:readthis.replace('C:/xampp/htdocs','http://localhost'),
                                                                                                                            episode:episode_number,
                                                                                                                            dualAudio:false,
                                                                                                                            subsBy:release_group,
                                                                                                                            ismkv:mkvtest,
                                                                                                                            BDrip:bdtest,
                                                                                                                            resolution:video_resolution,
                                                                                                                            codec:codec,
                                                                                                                            aspectRatio:aspect_ratio,
                                                                                                                            frameRate:frameRateMath,
                                                                                                                            audioTerm:audio_term
                                                                                                                        },{new:true},err=>{if(err)throw new Error(err)}).then((returnitem)=>{
                                                                                                                            if(returnitem){
                                                                                                                                resetEpisodes(readthis, saveRead, savedir,files)
                                                                                                                            }
                                                                                                                        });
                                                                                                                });
                                                                                                            });
                                                                                                        });
                                                                                                    });
                                                                                                });
                                                                                            }else{
                                                                                                console.log("no id file");
                                                                                                query = `
                                                                                                query($animetitle:String){
                                                                                                    Media(search:$animetitle type:ANIME){
                                                                                                        id
                                                                                                        idMal
                                                                                                        episodes
                                                                                                        duration
                                                                                                        format
                                                                                                        source
                                                                                                        status
                                                                                                        season
                                                                                                        description(asHtml:true)
                                                                                                        synonyms
                                                                                                        endDate {
                                                                                                            year
                                                                                                            month
                                                                                                            day
                                                                                                        }
                                                                                                        startDate {
                                                                                                            year
                                                                                                            month
                                                                                                            day
                                                                                                        }
                                                                                                        coverImage {
                                                                                                            large
                                                                                                        }
                                                                                                        bannerImage
                                                                                                        averageScore
                                                                                                        meanScore
                                                                                                        popularity
                                                                                                        favourites
                                                                                                        title {
                                                                                                            romaji
                                                                                                            english
                                                                                                            native
                                                                                                        }
                                                                                                        }
                                                                                                    }
                                                                                                    `;
                                                                                                variables = {
                                                                                                    animetitle: anime_title
                                                                                                }
                                                                                                url="https://graphql.anilist.co";
                                                                                                options = {
                                                                                                    method: 'POST',
                                                                                                    headers: {
                                                                                                        'Content-Type': 'application/json',
                                                                                                        'Accept': 'application/json',
                                                                                                    },
                                                                                                    body: JSON.stringify({
                                                                                                        query: query,
                                                                                                        variables: variables
                                                                                                    })
                                                                                                };
                                                                                                request(url, options, function (error, response, body){
                                                                                                    var ALbody = JSON.parse(body);
                                                                                                    extractFrame({
                                                                                                        input: readthis,
                                                                                                        output: __dirname+"/thumbnails/"+fileName+'.jpg',
                                                                                                        offset: Math.floor(Math.random()*240000)+50000,
                                                                                                        quality: 20
                                                                                                    }).then(()=>{
                                                                                                        options = {
                                                                                                            method: 'POST',
                                                                                                            url: "https://www.catgirls.forsale/api/upload",
                                                                                                            headers: {
                                                                                                                'Content-Type': 'multipart/form-data'
                                                                                                            },
                                                                                                            formData : {
                                                                                                                "key": 'lhrfmdcp49ni05w12xtkb7sjozgqvelhr8fmdcp49n35w12xtkb7souzgvaerfwt',
                                                                                                                "nolewd" : fs.createReadStream(__dirname+"/thumbnails/"+fileName+".jpg"),
                                                                                                                "animesup":"localanime"
                                                                                                            }
                                                                                                        }
                                                                                                        request(options, function (error, response, imgbody){
                                                                                                            uploadedImage = imgbody;
                                                                                                            console.log(uploadedImage);
                                                                                                            fs.unlink(__dirname+"/thumbnails/"+fileName+".jpg",(err)=>{
                                                                                                                if(err){throw new Error(err)}
                                                                                                                let synonyms = "";
                                                                                                                // for(let syn in media.synonyms){
                                                                                                                //     synonyms += media.synonyms[syn]+", ";
                                                                                                                // }
                                                                                                                var media = ALbody.data.Media;
                                                                                                                var alID = media.id,
                                                                                                                    malID = media.idMal,
                                                                                                                    episodes = media.episodes,
                                                                                                                    duration = media.duration,
                                                                                                                    format = media.format,
                                                                                                                    source = media.source,
                                                                                                                    status = media.status,
                                                                                                                    season = media.season,
                                                                                                                    description = media.description,
                                                                                                                    endDateYear = media.endDate.year,
                                                                                                                    endDateMonth = media.endDate.month,
                                                                                                                    endDateDay = media.endDate.day,
                                                                                                                    startDateYear = media.startDate.year,
                                                                                                                    startDateMonth = media.startDate.month,
                                                                                                                    startDateDay = media.startDate.day,
                                                                                                                    coverImg = media.coverImage.large,
                                                                                                                    banner = media.bannerImage,
                                                                                                                    averageScore = media.averageScore,
                                                                                                                    meanScore = media.meanScore,
                                                                                                                    popularity = media.popularity,
                                                                                                                    favourites = media.favourites,
                                                                                                                    titleRomaji = media.title.romaji,
                                                                                                                    titleEnglish = media.title.english,
                                                                                                                    titleNative = media.title.native;
                                                                                                                    Animes.findOneAndUpdate({_id:savedID},{
                                                                                                                        episodes:episodes,
                                                                                                                        duration:duration,
                                                                                                                        format:format,
                                                                                                                        source:source,
                                                                                                                        status:status,
                                                                                                                        season:season,
                                                                                                                        description:description,
                                                                                                                        synonyms:synonyms
                                                                                                                    },{new:true},err=>{if(err)throw new Error(err)}).then((res)=>{console.log(res)});
                                                                                                                    Titles.findOneAndUpdate({_id:savedtitlesRes},{
                                                                                                                        romaji:titleRomaji,
                                                                                                                        english:titleEnglish,
                                                                                                                        native:titleNative,
                                                                                                                        filetitle:anime_title
                                                                                                                    },{new:true},err=>{if(err)throw new Error(err)}).then((res)=>{console.log(res)});
                                                                                                                    Images.findOneAndUpdate({_id:savedImagesRes},{
                                                                                                                        cover:coverImg,
                                                                                                                        banner:banner
                                                                                                                    },{new:true},err=>{if(err)throw new Error(err)}).then((res)=>{console.log(res)});
                                                                                                                    Links.findOneAndUpdate({_id:savedLinksRes},{
                                                                                                                        idAL:alID,
                                                                                                                        idMAL:malID
                                                                                                                    },{new:true},err=>{if(err)throw new Error(err)}).then((res)=>{console.log(res)});
                                                                                                                    StartDate.findOneAndUpdate({_id:savedStartDates},{
                                                                                                                        startYear:startDateYear,
                                                                                                                        startMonth:startDateMonth,
                                                                                                                        startDay:startDateDay
                                                                                                                    },{new:true},err=>{if(err)throw new Error(err)}).then((res)=>{console.log(res)});
                                                                                                                    EndDate.findOneAndUpdate({_id:savedEndDate},{
                                                                                                                        endYear:endDateYear,
                                                                                                                        endMonth:endDateMonth,
                                                                                                                        endDay:endDateDay
                                                                                                                    },{new:true},err=>{if(err)throw new Error(err)}).then((res)=>{console.log(res)});
                                                                                                                    OffSiteScores.findOneAndUpdate({_id:savedOffsirescoresRes},{
                                                                                                                        alAverage:averageScore,
                                                                                                                        alMean:meanScore,
                                                                                                                        alPopularity:popularity,
                                                                                                                        alFavourites:favourites
                                                                                                                    },{new:true},err=>{if(err)throw new Error(err)}).then((res)=>{console.log(res)});
                                                                                                                    EpisodeLists.findOneAndUpdate({_id:savedEpisodesList},{
                                                                                                                        title:episode_title,
                                                                                                                        length:duration,
                                                                                                                        thumbnail:uploadedImage,
                                                                                                                        stream:readthis.replace('C:/xampp/htdocs','http://localhost'),
                                                                                                                        episode:episode_number,
                                                                                                                        dualAudio:false,
                                                                                                                        subsBy:release_group,
                                                                                                                        ismkv:mkvtest,
                                                                                                                        BDrip:bdtest,
                                                                                                                        resolution:video_resolution,
                                                                                                                        codec:codec,
                                                                                                                        aspectRatio:aspect_ratio,
                                                                                                                        frameRate:frameRateMath,
                                                                                                                        audioTerm:audio_term
                                                                                                                    },{new:true},err=>{if(err)throw new Error(err)}).then((returnitem)=>{if(returnitem)resetEpisodes(readthis, saveRead, savedir,files)});
                                                                                                            });
                                                                                                        });
                                                                                                    });
                                                                                                });
                                                                                            }
                                                                                    }).catch(err=>{throw new Error(err);});
                                                                                }).catch(err=>{throw new Error(err);});
                                                                            }).catch(err=>{throw new Error(err);});
                                                                        }).catch(err=>{throw new Error(err);});
                                                                    }).catch(err=>{throw new Error(err);});
                                                                }).catch(err=>{throw new Error(err);});
                                                            }).catch(err=>{throw new Error(err);});
                                                        }).catch(err=>{throw new Error(err);});
                                                    });
                                                }
                                            });     
                                        }
                                    });
                                }
                            });
                        });
                    }
                }
            });
        }
    }
    return "AYAYA"
}

//uwu();