import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import Slider from "@mui/material/Slider";
import axios from "axios";

const url = "https://randomuser.me/api/";

function App() {
  const [params, setParams] = React.useState({
    region: "",
    error: 0,
    seed: "",
  });
  const [data, setData] = React.useState([]);
  const [scroll, setScroll] = React.useState(false);

  const scrollContainer = React.useRef();
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];

  const handleAdd = (str) => {
    const newStr = str.replace(
      str[Math.floor(Math.random() * str.length)],
      `${str[Math.floor(Math.random() * str.length)]}` + `${randomCharacter}`
    );
    return newStr;
  };

  const handleDelete = (str) => {
    const newStr = str.replace(str[Math.floor(Math.random() * str.length)], "");

    return newStr;
  };

  const handleSwap = (str) => {
    const randomNum = Math.floor(Math.random() * (str.length - 2));
    const newStr = str.replace(
      `${str[randomNum]}` + `${str[randomNum + 1]}`,
      `${str[randomNum + 1]}` + `${str[randomNum]}`
    );
    return newStr;
  };

  const functions = [handleAdd, handleDelete, handleSwap];

  const handleSeedError = (arr) => {
   
    if(Number(params.error) === 0) {
      return arr;
    }
    let errorData = [];
    if (Number(params.error) > 0) {
      arr.map((record, index) => {
        const finalFunc = (callback, str, errorType) => {
          const errStr = callback(str);
          if (errorType === 1) record.name.first = errStr;
          if (errorType === 2) record.name.last = errStr;
          if (errorType === 3) record.location.street.name = errStr;
          if (errorType === 4) record.location.city = errStr;
          if (errorType === 5) record.location.country = errStr;
        };
        const targets = [
          record?.name.first,
          record?.name.last,
          record?.location.street.name,
          record?.location.city,
          record?.location.country,
        ];

        if (params.error === 0.5) {
          if (index % 2 === 0) {
            const errType = {
              func: Math.floor(Math.random() * 3),
              target: Math.floor(Math.random() * 5),
            };
            finalFunc(
              functions[errType.func],
              targets[errType.target],
              errType.target
            );
          }
          errorData.push(record);
        } else {
          for (let i = 0; i < params.error; i++) {
            const errType = {
              func: Math.floor(Math.random() * 3),
              target: Math.floor(Math.random() * 5),
            };

            finalFunc(
              functions[errType.func],
              targets[errType.target],
              errType.target
            );
          }
          errorData.push(record);
        }
      });
      return errorData;
    }
   
  };

  const generateData = async () => {
    const data = await axios
      .get(`${url}?results=20&nat=${params.region}&seed=${params.seed}`)
      .then((response) => {
        if (response.data.message) {
          console.log(response.data.message);
        } else {
          return response.data.results;
        }
      });

    const result = await handleSeedError(data);
    setData(result);
    setScroll(false);
  };

  const getExtraData = async () => {
    const extra = await axios
      .get(
        `${url}?results=10&nat=${params.region}&seed=${
          params.seed
        }&page=${Math.floor(Math.random() * 10000)}`
      )
      .then((response) => {
        if (response.data.message) {
          console.log(response.data.message);
        } else {
          return response.data.results;
        }
      });

      const result = await handleSeedError(extra)
    setData([...data, ...result]);
  };

  React.useEffect(() => {
    if (data?.length > 0 && scroll) {
      getExtraData();
    }
  }, [scroll]);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setScroll(entry.isIntersecting);
    });
    observer.observe(scrollContainer.current);
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          pt: "5%",
          mb: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            background: "white",
            p: "10px",
            borderRadius: "5px",
            columnGap: "15px",
          }}
        >
          <TextField
            id="outlined-select-currency"
            select
            label="Region"
            sx={{ width: "100px" }}
            value={params.region}
            onChange={(e) => setParams({ ...params, region: e.target.value })}
          >
            <MenuItem value="tr">Turkey</MenuItem>
            <MenuItem value="gb">United Kingdom</MenuItem>
            <MenuItem value="ir">Iran</MenuItem>
          </TextField>
          <Box
            sx={{
              width: "600px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ width: "150px" }}>Error Count:</Typography>
            <Slider
              sx={{ width: "350px" }}
              label="Error"
              valueLabelDisplay="auto"
              value={params?.error}
              step={0.5}
              marks
              min={0}
              max={1000}
              onChangeCommitted={(e, newValue) => {
                setParams({
                  ...params,
                  error: newValue,
                });
              }}
            />
            <TextField
              value={params.error}
              onChange={(e) => setParams({ ...params, error: e.target.value })}
              sx={{ ml: "15px" }}
              type="number"
              InputProps={{
                inputProps: {
                  max: 1000,
                  min: 0,
                },
              }}
            />
          </Box>
          <TextField
            value={params.seed}
            label="Seed"
            sx={{ width: "150px" }}
            onChange={(e) => setParams({ ...params, seed: e.target.value })}
          />
          <Button
            variant="contained"
            onClick={() => {
              generateData();
              // handleSeedError();
            }}
          >
            Random
          </Button>
        </Box>
      </Box>
      <TableContainer
        component={Paper}
        style={{ width: "70%", margin: "auto" }}
      >
        <Table aria-label="simple table">
          <TableHead sx={{ background: "#E8F8FD" }}>
            <TableRow>
              <TableCell>Index</TableCell>
              <TableCell>Random ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length > 0
              ? data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      {row?.phone?.substring(
                        row?.phone?.length - 4,
                        row?.phone?.length
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.name.first}
                      {` `} {row?.name.last}
                    </TableCell>
                    <TableCell>
                      {row?.location?.street?.name}, {row?.location.city},{" "}
                      {row?.location.postcode}, {row?.location?.country}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.phone}
                    </TableCell>
                  </TableRow>
                ))
              : ""}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ visibility: "hidden" }} ref={scrollContainer}>
        scroll check
      </div>
    </Box>
  );
}

export default App;
