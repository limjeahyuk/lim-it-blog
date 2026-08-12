---
title: '[React] data 관리'
pubDate: 2022-04-07
category: study/react-school
author: me
tags: []
draft: false
# 티스토리에서 옮겨왔습니다: https://hyuk-todayfeelsogood.tistory.com/25
---
### **Icon**

openweather api에서 제공하는 icon 말고 mui에서 제공하는 icon으로 변경하고 싶다.  
api에서 제공하는 icon은 고정적이지만  
mui에서 제공하는 icon으로 변경하면 원하는 icon으로 각각 설정 가능.

![](/images/react-school-25/1.png)

왼쪽 부터 mui icon / openapi icon

1.  openweather api에서 icon을 설정할 때 사용하는 것을 확인

 [Weather Conditions - OpenWeatherMap

Weather Conditions Home Weather Conditions

openweathermap.org](https://openweathermap.org/weather-conditions)

2\. Main 이름이 같은 것들 끼리 아이콘을 같게 하면 될 것 같음.

![](/images/react-school-25/2.png)

3\. data들을 적어놓는 js 파일을 json 형식으로 만들기.

```html
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import CloudIcon from '@mui/icons-material/Cloud';
...

export const weather_mapping_data = {
  Thunderstorm: {
    name: '폭우',
    icon: ThunderstormIcon,
  },
  Drizzle: {
    name: '이슬비',
    icon: CloudIcon,
  },
  Rain: {
    name: '비',
    icon: UmbrellaIcon,
  },
  Snow: {
    name: '눈',
    icon: AcUnitIcon,
  },
  Etc: {
    name: '기타',
    icon: DangerousIcon,
  },
  Clear: {
    name: '맑음',
    icon: WbSunnyIcon,
  },
  Clouds: {
    name: '구름',
    icon: FilterDramaIcon,
  },
};
```

다른 파일에서도 사용할 수 있도록 export 시켜준다.  
각각 name과 icon을 설정해준다.

4\. icon과 name을 페이지에 위치시켜준다.

```html
import { weather_mapping_data } from '../dataset/WeatherData';
...

const makeWeatherInfo = () => {
    const { temp, feels_like, temp_max, temp_min, humidity } = weatherData.main;
    const { main, icon } = weatherData.weather[0];
    const parseWeatherData = weather_mapping_data[main]
      ? weather_mapping_data[main]
      : weather_mapping_data['Etc'];

    const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    return (
      <Grid item xs={1} sm={2} md={4}>
        <Typography>{`현재날씨: ${parseWeatherData.name}`}</Typography>
        <parseWeatherData.icon sx={{ fontSize: 125, color: 'yellow' }} />
        <img src={iconUrl} alt="현재날씨 아이콘" />
        <Typography>{`현재온도: ${temp}℃ 체감온도: ${feels_like}℃`}</Typography>
        <Typography>
          {`최저기온: ${temp_min}℃ 최고기온: ${temp_max}℃ 습도: ${humidity}%`}
        </Typography>
      </Grid>
    );
```

-   위에서 export 해준 것을 import 해준다.
-   전에 중복되고 있었던 weatherData.main을 선언해줌으로써 좀 더 간결한 코드가 되도록 만든다.
-   ? : 를 이용하여 예외처리를 해준다.  
    \> 만약 설정해놓은 날씨 말고 다른 값이 들어오게 된다면 전부 Etc로 들어가도록..
-   <parseWeatherData.icon />을 사용하여 설정해논 icon을 위치시킨다.  
    그 이후는 icon css를 간단하게 설정. 

* * *

### **lat & lon**

\- 위치도 웹사이트 상에서 바꾸면서 날씨 정보를 알고 싶다.  
현재는 설정해놓은 하나의 위치밖에 보지 못하는 상태.

icon에서 그랬던 것처럼 data 들을 WeatherData.js에 json 형식으로 정리해놓는다.

```html
export const cityLatLon = [
  { name: '서울', lat: 37.5326, lon: 127.0246 },
  { name: '안양', lat: 37.3911, lon: 126.9677 },
  { name: '제주', lat: 33.4405, lon: 126.3998 },
  { name: '부산', lat: 35.1666, lon: 129.0666 },
  { name: '대전', lat: 36.4535, lon: 127.4319 },
  { name: '광주', lat: 35.1798, lon: 126.8781 },
  { name: '울산', lat: 37.7678, lon: 129.3114 },
  { name: '시흥', lat: 37.3799, lon: 126.8031 },
  { name: '파리', lat: 48.8566, lon: 2.3522 },
  { name: 'USA', lat: 34.0522, lon: -118.2436 },
];
```

-   weather\_mapping\_data와는 다르게 cityLatLon은 배열이다.

```html
import { cityLatLon } from './dataset/WeatherData';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
...

function App() {
  const [selectedCityData, setSelectedCityData] = useState({
    name: '안양',
    lat: 37.3943,
    lon: 126.9568,
  });
  
...

  useEffect(() => {
    const callApi = async () => {
      try {
        const result = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCityData.lat}&lon=${selectedCityData.lon}&lang=kr&units=metric&&appid=db07f8319467878d8d2ee4c5d2b038b4`,
        );
        setWeatherData(result.data);
      } catch (err) {
        setApiError(err);
      }
    };
    callApi();
  }, [selectedCityData]);
  

  const selectHandleChange = (event) => {
  };

...

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: useDarkMode ? 'dark' : 'light',
        },
      })}
    >
      <Box
        sx={{
          minHeight: '100%',
          bgcolor: 'background.default',
          color: 'text.primary',
          p: 1,
        }}
      >
        <Container maxWidth="lg">
          <FormControl>
            <InputLabel id="selected-city-label">도시</InputLabel>
            <Select
              labelId="selected-city-label"
              id="selectd-city"
              value={selectedCityData.name}
              label="도시"
              onChange={selectHandleChange}
            >
              {cityLatLon.map((city) => (
                <MenuItem value={city.name}>{city.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <WeatherCard weatherData={weatherData} apiError={apiError} />
            <WeatherCard weatherData={weatherData} apiError={apiError} />
            <WeatherCard weatherData={weatherData} apiError={apiError} />
          </Grid>

          <Switch
            checked={useDarkMode}
            onChange={handleChange}
            color="warning"
            inputProps={{ 'aria-label': 'controlled' }}
          />

          <UserCardList userDatas={userDatas} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
```

-   Lat & Lon은 App.js에서 설정하므로 App.js 에서 작업한다.
-   WeatherData에서 export 한 cityLatLon을 import 한다.
-   useState를 사용하여 사용자가 도시를 정할 때마다 state가 바뀌도록  
    const \[selectedCityData, setSelectedCityData\] = useState({ 초기값 }); 설정해준다.
-   useEffect를 통하여 setSelectedCityData가 실행될 때만 실행되도록 한다.  
    '작은따옴표' 였던 것을 \`\`로 변경하여 lat=${selectedCityData.lat}&lon=${selectedCityData.lon}을 불러온다.  
    여기까지 하면 selecteCityData에 값이 바뀌면 저장해둔 lat과 lon이 들어가게 되면서 변경된다.
-   selectHandleChange라는 함수를 만든다.  
    event가 실행되고 나면 사용자가 선택한 cityname으로 setSelectedCityData를 실행해줄 예정.
-   return () 안에 도시를 선택할 select를 추가할 것.  
    mui에서 select를 가지고 온다.

 [React Select component - MUI

Select components are used for collecting user provided information from a list of options.

mui.com](https://mui.com/components/selects/#main-content)

-   FormControl 부분만 가지고 와서 id 값과 value를 알맞게 변경.  
    onChange는 만들기로 한 selectHandleChange 함수를 넣어준다.
-   안에 내용은 

```html
<MenuItem value={'서울'}>Ten</MenuItem>
<MenuItem value={'안양'}>Twenty</MenuItem>
<MenuItem value={'부산'}>Thirty</MenuItem>
<MenuItem value={'광주'}>Thirty</MenuItem>
<MenuItem value={'제주'}>Thirty</MenuItem>
<MenuItem value={'울산'}>Thirty</MenuItem>
<MenuItem value={'대전'}>Thirty</MenuItem>
<MenuItem value={'시흥'}>Thirty</MenuItem>
```

-   이런 식으로 넣을 수도 있지만 너무 고전적이며 하나하나 넣어줘야 한다.  
    추가로 새로운 값이 들어올 때마다 넣어줘야 하는 번거로움이 있다.

```html
{cityLatLon.map((city) => (
              <MenuItem value={city.name}>{city.name}</MenuItem>
            ))}
```

-   이런 식으로 map 함수를 이용하여 cityLatLon에 있는 값들을 전부 넣어줄 수 있다.
-   마지막 selectHandleChange 함수를 완성해야 한다.

```html
const selectHandleChange = (event) => {
    const cityname = event.target.value;
    const findCityName = cityLatLon.find((data) => data.name === cityname);
    setSelectedCityData(findCityName);
  };
```

-   value의 값을 cityname에 저장해둔다.
-   **find 함수**를 통하여 cityLatLon에 name이 cityname과 같은 것을 찾아서 findCityName에 저장해준다.
-   findCityName으로 setSectedCityData를 실행해준다.

여기까지 App.js 변경점과 실행방법.

* * *

### **Find 함수**

 [Array.prototype.find() - JavaScript | MDN

find() 메서드는 주어진 판별 함수를 만족하는 첫 번째 요소의 값을 반환합니다. 그런 요소가 없다면 undefined를 반환합니다.

developer.mozilla.org](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/find)

위 설명을 보면 더욱 자세히 나와있습니다.

배열 내에 조건에 맞는 것을 가지고 오는 함수.

* * *

### **setInterval 함수**

setInterval은 일정 시간 간격을 두고 계속해서 함수를 실행해준다.  
비슷한 함수로는 setTimeout이 있으나   
setTimeout은 일정 시간이 지난 후에 함수를 실행하는 차이가 있습니다.

```html
 useEffect(() => {
    const changeFontColor = () => {
      setFontColor(`rgb(${getRandomInt(0, 255)},${getRandomInt(0, 255)},${getRandomInt(0, 255)})`);
    };

    setInterval(changeFontColor, 1000);
  }, []);
```

-   changeFontColor 함수를 1초마다 실행시켜줍니다.
