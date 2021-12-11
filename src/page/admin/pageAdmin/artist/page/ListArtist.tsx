import React, { useReducer, useEffect, useState } from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { Button, Checkbox, TextField, Typography, CircularProgress, Box } from "@mui/material"
import { Select, MenuItem, Menu, Avatar } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search'
import { initialReducer, handleReducer, HandleGet, typeAciton, pustAction } from "component/MethodCommon"
import { makeStyles } from "@mui/styles"
import { page } from "../index"
import ArtistApi from 'api/ArtistApi'
import PaginationArtist from '../component/PaginationArtist'
import { variableCommon } from "component/variableCommon"
import ModalArtist from '../component/ModalArtist'

interface ListArtist<T> {
  changePage: any,
  set_id: Function
}

const useStyle = makeStyles((theme) => ({
  styleBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}))

const columns = [
  { id: 'fist', label: 'Fist_Name', minWidth: 150, align: 'left' },
  { id: 'last', label: 'Last_Name', minWidth: 150, align: 'left' },
  { id: 'image', label: 'Image', minWidth: 150, align: 'left' },
  { id: 'gender', label: 'Gender', minWidth: 150, align: 'left' },
  { id: '', label: 'Handle', minWidth: 170, align: 'center' },
];

const ListArtist: React.FC<ListArtist<any>> = ({ changePage, set_id, ...props }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //
  const classes = useStyle();
  const [state, dispatch] = useReducer(handleReducer, initialReducer);
  const [stateArtist, setStateArtist] = useState<any>({ display: false, _id: null });

  useEffect(() => {
    (async () => {
      const query = {
        ...state.Filter
      }
      const [data, error] = await HandleGet(ArtistApi.getAll, query);
      delete query._limit;
      delete query._page
      const checkFindName = Object.entries(query).length;
      var [dataStatic] = await HandleGet(ArtistApi.getAll, checkFindName ? { ...query } : {});

      if (data?.status !== variableCommon.statusS) return dispatch(pustAction(typeAciton.error))

      setTimeout(() => {
        dispatch(pustAction(typeAciton.getData, { Data: data?.data, dataStatic: dataStatic?.data }))
      }, 1000);

    })()
    return () => {
      dispatch(pustAction(typeAciton.reset))
    }
  }, [state.Filter])

  const findName = (event: Event | any) => {
    const getValue = ((event.target as HTMLInputElement).value).trim()
    if (event.keyCode === 13) {
      // let nameArtist = `${first_Name} ${last_Name}`;
      dispatch(pustAction(typeAciton.findName, { first_Name: getValue }))
    }
  }

  const onOpen = <T extends string>(_id: T) => {
    if ([undefined, null].includes(_id as any)) return;
    setStateArtist((value: any) => ({ _id, display: true }))
  }

  const onClose = () => {
    setStateArtist((value: any) => ({ ...value, display: false }))
  }

  const navigatePage = <T extends string>(page: T, _id?: T): void => {
    changePage(page);
    if (_id) set_id(_id)
  }

  const deleteOne = async (_id: string) => {
    if (!_id) return;
    dispatch(pustAction(typeAciton.deleteOne, { _id }))

    await ArtistApi.deleteOne(_id);
  }

  const deleteAll = () => {
    dispatch(pustAction(typeAciton.deleteAll))
    state.Data.forEach(async (currenV: any) => {
      const { _id, check } = currenV;
      if (check) {
        await ArtistApi.deleteOne(_id);
      }
    })
  }
  return (
    <>
      {stateArtist._id && <ModalArtist state={stateArtist} onClose={onClose}></ModalArtist>}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '800px',
        width: "100%"
      }}>
        <div style={{ flexBasis: 1000, margin: "0 auto" }}>
          <h2 className="mb-5">Artist</h2>
          <Paper sx={{ width: '100%' }}>
            <TableContainer style={{ padding: 20 }}>
              <Typography style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <TextField
                  InputProps={{
                    startAdornment: <SearchIcon style={{ marginRight: 10 }}></SearchIcon>,
                    placeholder: "searching"
                  }}
                  onKeyDown={findName}
                  size="small"
                />
                <Select
                  labelId="demosimpleselectlabel"
                  id="demosimpleselect"
                  label="Age"
                  value={10}
                  size="small"
                  style={{ width: 200 }}
                >
                  <MenuItem value={10}>sort date</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </Typography>

              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      key="awd"
                      align='left'
                      style={{ minWidth: 110 }}
                    >
                      <Checkbox
                        id="checkAll"
                        onClick={() => { dispatch(pustAction(typeAciton.checkAll)) }}
                        checked={state.checkAll}
                      />
                      <label htmlFor="checkAll"> All</label>
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align as any}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    state.Data.length && state.Display ?
                      state.Data.map((row: any, index: any) => {
                        const { first_Name, last_Name, gender, image, check, _id } = row;
                        return (
                          <TableRow hover role="checkbox" key={index}>
                            <TableCell align='left'>
                              <Checkbox checked={check} onClick={() => {
                                dispatch(pustAction(typeAciton.checkOne, { _id }))
                              }} />
                            </TableCell>
                            <TableCell align='left'>
                              {first_Name}
                            </TableCell>
                            <TableCell align='left'>
                              {last_Name}
                            </TableCell>
                            <TableCell align='left'>
                              <Avatar alt="Remy Sharp" variant="rounded" src={image} />
                            </TableCell>
                            <TableCell align='left'>
                              {gender === true ? 'Nam' : 'Nữ'}
                            </TableCell>
                            <TableCell align='center'>
                              <div>
                                <Button
                                  id="demo-positioned-button"
                                  aria-controls="demo-positioned-menu"
                                  aria-haspopup="true"
                                  aria-expanded={open ? 'true' : undefined}
                                  onClick={handleClick}
                                >
                                  Click
                                </Button>
                                <Menu
                                  id="demo-positioned-menu"
                                  aria-labelledby="demo-positioned-button"
                                  anchorEl={anchorEl}
                                  open={open}
                                  onClose={handleClose}
                                  anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                  }}
                                  transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                  }}
                                >
                                  <div onClick={handleClose}><MenuItem onClick={() => { deleteOne(_id) }}>Delete</MenuItem></div>
                                  <div onClick={handleClose}><MenuItem onClick={() => { navigatePage(page.UpdateArtist, _id) }}>Edit</MenuItem></div>
                                  <div onClick={handleClose}><MenuItem onClick={() => { onOpen<string>(_id) }}>More</MenuItem></div>
                                </Menu>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      }) :
                      state.Display ? null : <TableRow>
                        <TableCell align='center' colSpan={12} >
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                  }
                </TableBody>
              </Table>
              <Box className={classes.styleBox}>
                <div>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={deleteAll}
                  >
                    Delete All
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    style={{ marginLeft: 5 }}
                    onClick={() => { navigatePage(page.AddArtist) }}
                  >
                    Add
                  </Button>
                </div>
                <PaginationArtist state={state} dispatch={dispatch} />
              </Box>
            </TableContainer>
          </Paper>
        </div>
      </div>
    </>
  )
}

export default ListArtist
