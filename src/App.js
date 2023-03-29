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

// api :  https://randomuser.me/documentation#howto

const url = "https://randomuser.me/api/";

function App() {
    const [params, setParams] = React.useState({
        region: "",
        error: 0,
        seed: "",
    });
    const [data, setData] = React.useState([]);
    const [scroll, setScroll] = React.useState(false)
    const ref = React.useRef()
    

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    console.log('scroll',scroll)
     setScroll(bottom)
      }

   

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
    };

  
  

    return (
        <Box >
           
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
                        onChange={(e) =>
                            setParams({ ...params, region: e.target.value })
                        }
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
                        <Typography sx={{ width: "150px" }}>
                            Error Count:
                        </Typography>
                        <Slider
                            label="Temperature"
                            defaultValue={30}
                            // getAriaValueText={3}
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={1000}
                        />
                        <TextField
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
                        onChange={(e=>setParams({...params,seed:e.target.value}))}
                    />
                    <Button variant="contained" onClick={() => generateData()}>
                        Random
                    </Button>
                </Box>
            </Box>
            <TableContainer
            // onScroll={handleScroll}
           
                component={Paper}
                style={{ width: "70%", margin: "auto" }}
              
            >
                <Table aria-label="simple table"    >
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
                                      sx={{
                                          "&:last-child td, &:last-child th": {
                                              border: 0,
                                          },
                                      }}
                                  >
                                      <TableCell component="th" scope="row">
                                          {index + 1}
                                      </TableCell>
                                      <TableCell>
                                      {row?.phone?.substring(row?.phone?.length-4, row?.phone?.length)}
                                      </TableCell>
                                      <TableCell component="th" scope="row">
                                          {row?.name.first}
                                          {` `} {row?.name.last}
                                      </TableCell>
                                      <TableCell>
                                          {row?.location?.street?.name},{" "}
                                          {row?.location.city},{" "}
                                          {row?.location.postcode},{" "}
                                          {row?.location?.country}
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
        </Box>
    );
}

export default App;
