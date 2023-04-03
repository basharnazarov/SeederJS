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
    const [page, setPage] = React.useState(1);

    const scrollContainer = React.useRef();

    const handleAdd = (str, record, errorType) => {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        const newStr = str.replace(
            str[str.length - 2],
            `${alphabet[errorType]}`
        );

        if (errorType === 0) record.name.first = newStr;
        if (errorType === 1) record.name.last = newStr;
        if (errorType === 2) record.location.street.name = newStr;
        if (errorType === 3) record.location.city = newStr;
    };

    const handleDelete = (str, record, errorType) => {
        let newStr = "";
        if (str.length % 2 === 0) {
            newStr = str.replace(str[0], "");
        } else {
            newStr = str.replace(str[str.length - 1], "");
        }

        if (errorType === 0) record.name.first = newStr;
        if (errorType === 1) record.name.last = newStr;
        if (errorType === 2) record.location.street.name = newStr;
        if (errorType === 3) record.location.city = newStr;
    };

    const handleSwap = (str, record, errorType) => {
        let newStr = "";
        if (errorType % 2 === 0) {
            newStr = str.replace(
                // eslint-disable-next-line no-useless-concat
                `${str[str.length - 2]}` + `${str[str.length - 1]}`,
                // eslint-disable-next-line no-useless-concat
                `${str[str.length - 1]}` + `${str[str.length - 2]}`
            );
        } else {
            newStr = str.replace(
                // eslint-disable-next-line no-useless-concat
                `${str[0]}` + `${str[1]}`,
                // eslint-disable-next-line no-useless-concat
                `${str[errorType % 2]}` + `${str[str.length - 1]}`
            );
        }

        if (errorType === 0) record.name.first = newStr;
        if (errorType === 1) record.name.last = newStr;
        if (errorType === 2) record.location.street.name = newStr;
        if (errorType === 3) record.location.city = newStr;
    };

    const handleSeedError = (arr) => {
        if (Number(params.error) === 0) {
            return arr;
        }
        let errorData = [];
        const remainder = Number(params.error) % 4;
        const iterCount = (Number(params.error) - remainder) / 4;

        if (Number(params.error) === 0.5) {
            data.forEach((record, index) => {
                const targets = [
                    record?.name.first,
                    record?.name.last,
                    record?.location.street.name,
                    record?.location.city,
                ];
                if (index % 2 !== 0) {
                    for (let j = 0; j < 1; j++) {
                      handleAdd(targets[j], record, j);
                    }
                    errorData.push(record);
                } else {
                  errorData.push(record)
                }
            });
        } else {
            data.forEach((record) => {
                const targets = [
                    record?.name.first,
                    record?.name.last,
                    record?.location.street.name,
                    record?.location.city,
                ];

                for (let i = 0; i <= iterCount; i++) {
                    if (i === iterCount) {
                        for (let j = 0; j < remainder; j++) {
                            if (j === 1) {
                                handleSwap(targets[j], record, j);
                            } else if (j === 2) {
                                handleDelete(targets[j], record, j);
                            } else {
                                handleAdd(targets[j], record, j);
                                handleAdd(targets[j], record, j);
                            }
                        }
                    } else {
                        for (let j = 0; j < targets.length; j++) {
                            if (j === 1) {
                                handleSwap(targets[j], record, j);
                                handleAdd(targets[j], record, j);
                            } else if (j === 2) {
                                handleDelete(targets[j], record, j);
                            } else {
                                handleAdd(targets[j], record, j);
                                handleDelete(targets[j], record, j);
                            }
                        }
                    }
                }

                errorData.push(record);
            });
        }

        return errorData;
    };

    const generateData = async () => {
        const data = await axios
            .get(`${url}?results=20&nat=${params.region}&seed=${params.seed}`)
            .then((response) => {
                if (response.data.message) {
                    console.log(response.data.message);
                } else {
                    setPage(page + 1);
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
                `${url}?results=10&nat=${params.region}&seed=${params.seed}&page=${page}`
            )
            .then((response) => {
                if (response.data.message) {
                    console.log(response.data.message);
                } else {
                    setPage(page + 1);
                    return response.data.results;
                }
            });

        const result = await handleSeedError(extra);
        setData([...data, ...result]);
    };

    React.useEffect(() => {
        if (params.region || params.error || params.seed) {
            generateData();
        }
    }, [params.error, params.region, params.seed]);

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
                            onChange={(e) =>
                                setParams({ ...params, error: e.target.value })
                            }
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
                        onChange={(e) =>
                            setParams({ ...params, seed: e.target.value })
                        }
                    />
                    <Button
                        variant="contained"
                        onClick={() => {
                            generateData();
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
                                          {row?.location?.street?.name},{" "}
                                          {row?.location.postcode},
                                          {row?.location.city}
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
