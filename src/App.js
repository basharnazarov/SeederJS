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

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setScroll(entry.isIntersecting);
    });
    observer.observe(scrollContainer.current);
  }, []);

  const getExtraData = async () => {
    const extra = await axios
      .get(`${url}?results=10&nat=${params.region}&seed=${params.seed}`)
      .then((response) => {
        if (response.data.message) {
          console.log(response.data.message);
        } else {
          return response.data.results;
        }
      });

    setData([...data, ...extra]);
  };

  const handleError = () => {
    if (params.error > 0) {
      const equalProbablity = Math.floor(params.error / 3);
      const alphabet = "abcdefghijklmnopqrstuvwxyz";
      const randomCharacter =
        alphabet[Math.floor(Math.random() * alphabet.length)];
      const errorData = [];
      data.forEach((record, index) => {
        if(index % 2 === 0){
            for (let i = 0; i < equalProbablity; i++) {
                record.name?.first = 
            }
        }else{
            for (let i = 0; i < equalProbablity; i++) {

            }
        }
       
      });
    }
  };

  React.useEffect(() => {
    if (data.length > 0 && scroll) {
      getExtraData();
    }
  }, [scroll]);

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

    setData(data);
    setScroll(false);
  };

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
              step={1}
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
          <Button variant="contained" onClick={() => generateData()}>
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
            {data.length > 0
              ? data.map((row, index) => (
                  <TableRow
                    key={index}
                  >
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
