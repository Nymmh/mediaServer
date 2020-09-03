const {gql} = require('apollo-server-express');
//delete anime
//delete episode
//update anime
module.exports.typeDefs = gql`
    type Query {
        anime(_id:ID,format:String,season:String,source:String,status:String,updatedsort:Boolean):[Anime!]!
        animeSearch(romaji:String):[AnimeSearch!]!
        episodeSearch(_id:ID):[EpisodeSearch!]!
        thumbnailUpdateRequests(animelink:String):[RequestUpdate]
        episodeUpdateRequests(animelink:String):[RequestUpdate]
    }
    type Mutation{
        createAnime(directory:String!):[Anime]
        deleteAnime(_id:ID):Anime
        deleteEpisode(_id:ID):Anime
        updateThumbnail(_id:ID,file:String):Anime
        updateAnime(_id:ID,title:String,parent:String,episodes:Int,duration:Int,format:FormatTypes,source:SourceTypes,status:StatusTypes,season:SeasonTypes):Anime
        requestUpdate(_id:ID,updateType:UpdateType,alid:String,animeid:String,episodeid:String,animelink:String):RequestUpdate
    }
    type AnimeSearch{
        _id:ID
        titles:[AnimeTitles!]!
    }
    type EpisodeSearch{
        _id:ID
        episodeLists:[episodeLists!]!
    }
    type Anime {
        _id:ID
        id:String!
        episodes:Int!
        duration:Int!
        format:FormatTypes!
        source:SourceTypes!
        status:StatusTypes!
        season:SeasonTypes!
        description:String
        synonyms:String
        titles:[AnimeTitles!]!
        images:[AnimeImages!]!
        offsiteLinks:[offsiteLinks!]!
        offsiteScores:[offsiteScores]!
        startDate:[startDate]!
        endDate:[endDate]!
        episodeLists:[episodeLists]!
    }
    type AnimeTitles{
        parent:String!
        romaji:String!
        english:String
        native:String
        filetitle:String!
    }
    type AnimeImages{
        cover:String!
        banner:String
    }
    type offsiteLinks{
        idAL:String
        idMAL:String
        idNymh:String
    }
    type startDate{
        startYear: Int
        startMonth: Int
        startDay: Int
    }
    type endDate{
        endYear: Int
        endMonth: Int
        endDay: Int
    }
    type offsiteScores{
        alAverage: Int!
        alMean: Int!
        alPopularity: Int!
        alFavourites: Int!
    }
    type episodeLists {
        _id:ID
        parent:String!
        title:String
        length:String
        thumbnail:String!
        stream:String!
        episode:String
        size:String
        ismkv:Boolean!
        BDrip:Boolean!
        resolution:String
        codec:String
        frameRate:String
        aspectRatio:String
        dualAudio:Boolean!
        subsBy:String
        audioTerm:String
    }
    type RequestUpdate{
        alid:String
        animeid:String
        episodeid:String
        animelink:String
    }
    enum FormatTypes{
        TV
        TV_SHORT
        MOVIE
        SPECIAL
        OVA
        ONA
        MUSIC
        UNKNOWN
    }
    enum SeasonTypes{
        WINTER
        SPRING
        SUMMER
        FALL
        UNKNOWN
    }
    enum SourceTypes{
        ORIGINAL
        MANGA
        LIGHT_NOVEL
        VISUAL_NOVEL
        VIDEO_GAME
        OTHER
        NOVEL
        DOUJINSHI
        ANIME
        UNKNOWN
    }
    enum StatusTypes{
        FINISHED
        RELEASING
        NOT_YET_RELEASED
        CANCELLED
        UNKNOWN
    }
    enum UpdateType{
        thumbnail
        ALdata
        episode
    }
`;