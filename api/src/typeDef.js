const {gql} = require('apollo-server-express');
module.exports.typeDefs = gql`
    type Query {
        anime:[Anime!]!
    }
    type Mutation{
        createAnime(directory:String!):[Anime]
    }
    type Anime {
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
        romaji:String!
        english:String
        native:String
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
        title:String!
        length:String
        thumbnail:String!
        stream:String!
        episode:String!
        size:String
        ismkv:Boolean!
        BDrip:Boolean!
        resolution:String!
        codec:String!
        frameRate:String!
        aspectRatio:String!
        dualAudio:Boolean!
        subsBy:String
        audioTerm:String
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
`;