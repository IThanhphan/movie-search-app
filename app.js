const { BrowserRouter, Link, Route, Switch, NavLink, withRouter } = ReactRouterDOM;
const movieNameContext = React.createContext();
const movieContext = React.createContext();
const API_KEY = '527100f44efa53b27e1955055774b9cb';
let isUseSideBars = false;

function Header({ onQuery }) {
    const [searchValue, setSearchValue] = React.useState('');
    const inputElement = React.useRef();
    function handleClick() {
        onQuery(searchValue)
        setSearchValue('');
        inputElement.current.focus();
        isUseSideBars=false;
    }
    return (
        <div className="header">
            <img src="https://files.readme.io/29c6fee-blue_short.svg" className="logo"></img>
            <div className="search">
                <input 
                    ref={inputElement}
                    type="text" 
                    className="search_input" 
                    placeHolder="search movie"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                ></input>
                <button 
                    className="search_btn"
                    onClick={() => handleClick()}
                ><i class="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>
        </div>
    )
}

function SideBars({ onPostType }) {
    const types = [
        {   
            name: 'Kinh dị',
            id: 27
        }, 
        {
            name: 'Hài hước',
            id: 35
        }, 
        {
            name: 'Lãng mạn', 
            id: 10749
        },
        {
            name: 'Phiêu lưu',
            id: 12
        }, 
        {
            name: 'Hành động',
            id: 28
        }, 
        {
            name: 'Drama',
            id: 18
        }, 
        {
            name: 'Âm nhạc',
            id: 10402
        }, 
        {
            name: 'Khoa học viễn tưởng',
            id: 878
        }, 
        {
            name: 'Trinh thám',
            id: 80 
        }, 
        {
            name: 'Tài liệu',
            id: 99
        }, 
        {
            name: 'Chiến tranh',
            id: 10752
        },
        {
            name: 'TV Movie',
            id: 10770
        }, 
        {
            name: 'Hoạt hình',
            id: 16
        }
    ];
    const [indexValue, setIndexValue] = React.useState();

    function handleClick(movieTypeIndex, movieTypeId, movieTypeName) {
        setIndexValue(movieTypeIndex);
        onPostType(movieTypeId, movieTypeName);
        isUseSideBars=true;
    }
    return (
        <div className="side-bars">
            <h1 className="type-title">Thể loại</h1>
            <ul className="types">
                {types.map((type, index) => {
                    return (
                        <li 
                            className="type-list"
                            onClick={(e) => handleClick(index, type.id, type.name)}
                            style={(indexValue === index && isUseSideBars) ? {
                                backgroundColor: "#07396ed8",
                                color: "white"
                            } : {}}
                        >{type.name}</li>
                    )
                })}
            </ul>
        </div>
    )
}

function Content({ movieTypes, movieTypeName }) {
    const [showOverViewIndex, setShowOverViewIndex] = React.useState();
    const movieName = isUseSideBars ? movieTypeName : React.useContext(movieNameContext);
    const movies = isUseSideBars ? movieTypes : React.useContext(movieContext);
    const overviewElement = React.useRef();
    function renderOverview(e, index) {
        setShowOverViewIndex((pre => {
            pre=index;
            return pre;
        }));

        let rect = overviewElement.current.getBoundingClientRect();
        let left = e.pageX+10;
        let top = e.pageY+10;

        if (rect.right >= window.innerWidth-20 || left+rect.width >= window.innerWidth-20) {
            left = e.pageX-10-rect.width;
        } 

        if (rect.bottom >= window.innerHeight || top+rect.height >= window.innerHeight) {
            top = e.pageY-10-rect.height;
        }

        overviewElement.current.setAttribute(
            'style', 
            `display: block;
            left: ${left}px;
            top: ${top}px;`
        );  
    }
    return (
        <div className="content">
            <h1 className="content-title">Phim {movieName}</h1>
            <div className="movie-list">
                {movies.results && movies.results.map((movie, index) => {
                    return movie.poster_path ? (
                        <div 
                            className="movie-detail"
                            onMouseLeave={(e) => setShowOverViewIndex(-1)}
                            onMouseMove={(e) => renderOverview(e, index)}
                        >
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}></img>
                            <h2 style={{padding: '0 5px'}}>{movie.title}</h2>
                            <h3>Vote: {movie.vote_average}</h3>
                            <h3>Release date: {movie.release_date}</h3>
                            {showOverViewIndex===index ?
                                <div ref={overviewElement} className="movie-overview">Overview: {movie.overview}</div> : <></>
                            }   
                        </div>
                    ) : (<></>)
                })}
            </div>
        </div>
    )
}

function Main() {
    const [typeId, setTypeId] = React.useState();
    const [typesMovie, setTypesMovie] = React.useState({});
    const [typeMovieName, setTypeMovieName] = React.useState('');

    React.useEffect(() => {
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${typeId}&language=en-US`)
            .then(res => res.json())
            .then(res => setTypesMovie(res))
            .catch(() => {throw new Error('Invalid value')});
    }, [typeId]);

    function handleSetTypeId(id, name) {
        setTypeId(id);
        setTypeMovieName(name)
    }

    return (
        <div class="main">
            <div className="main-content">
                <SideBars onPostType={handleSetTypeId}></SideBars>
                <Content movieTypes={typesMovie} movieTypeName={typeMovieName}></Content>
            </div>
        </div>
    )
}

function Footer() {
    return (
        <div className="footer">
            <h2>Name: Phan Sĩ Thành</h2>
            <p>Class: 65CNTT-CLC</p>
            <p>Phone number: 0373430192</p>
            <p>Email: <a href="mailto:thanh.ps.65cntt@ntu.edu.vn">thanh.ps.65cntt@ntu.edu.vn</a></p>
        </div>
    )
}

function App() {
    const [queryMovie, setQueryMovie] = React.useState('');
    const [resultMovie, setResultMovie] = React.useState({});

    React.useEffect(() => {
        fetch(`https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&api_key=${API_KEY}&query=${queryMovie}`)
            .then(res => res.json())
            .then(res => setResultMovie(res))
            .catch(() => {throw new Error('Invalid value')});
    }, [queryMovie]);

    function handleQuery(query) {
        setQueryMovie(query);
    }

    return (
        <>
            <movieNameContext.Provider value={queryMovie}>
                <movieContext.Provider value={resultMovie}>
                    <Header onQuery={handleQuery}></Header>
                    <Main></Main>
                    <Footer></Footer>
                </movieContext.Provider>
            </movieNameContext.Provider>
        </>
    )
}

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);