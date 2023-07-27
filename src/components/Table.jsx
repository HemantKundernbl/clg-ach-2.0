import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { CircularProgress, TextField, Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Table = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 3);
  const initToDate = date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  console.log(initToDate);
  date.setMonth(date.getMonth() + 1);
  const initFromDate = date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const [open, setOpen] = useState(true);
  const [showalert, setShowalert] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = `https://clguat.nablasol.net/rest/v11_1/getAchPayments?from_date=${fromDate}&to_date=${toDate}`;
      console.log(url);
      const res = await axios.get(url);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleActionClick = async (id, action) => {
    let collectionStatus = action === "accept" ? 1 : 2;
    const url = `https://clguat.nablasol.net/rest/v11_1/updateAchPayments?pid='${id}'&collection_status=${collectionStatus}`;
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        alert("Success !");
      }
    } catch (error) {
      setShowalert(false);
      alert("Failed!");
      console.log(error);
    }
  };

  const handleFilterClick = () => {
    fetchData(); // Fetch data when the filter button is clicked
    setFromDate("");
    setToDate("");
  };

  const rowsData = data.map((row) => {
    return {
      id: row.payment_id,
      lead_id: row.lead_id,
      name: row.name,
      collected_amount: row.amount,
      collected_date: row.payment_date,
      collected_by: row.collected_by || "NA",
      payment_mode: row.payment_mode,
    };
  });

  const columns = [
    { field: "lead_id", headerName: "LEAD ID", width: 125, minWidth: 200 },
    { field: "name", headerName: "NAME", width: 125, minWidth: 200 },
    {
      field: "collected_amount",
      headerName: "COLLECTED AMOUNT",
      width: 125,
      minWidth: 200,
    },
    {
      field: "collected_date",
      headerName: "COLLECTED DATE",
      width: 125,
      minWidth: 200,
    },
    {
      field: "collected_by",
      headerName: "COLLECTED BY",
      width: 125,
      minWidth: 200,
    },
    {
      field: "payment_mode",
      headerName: "PAYMENT MODE",
      width: 125,
      minWidth: 200,
    },
    {
      field: "approval",
      headerName: "APP/REV/REJ",
      width: 150,
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex flex-row justify-between gap-2">
          <button
            onClick={() => handleActionClick(params.row.id, "accept")}
            className="bg-black rounded"
          >
            <CheckIcon className="text-white" />
          </button>
          <button
            onClick={() => handleActionClick(params.row.id, "reject")}
            className="bg-black rounded"
          >
            <ClearIcon className="text-white" />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="table-container">
      <div className="flex flex-row justify-start items-center gap-3 ml-10 pt-10 pb-8">
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" onClick={handleFilterClick}>
          Apply Filter
        </Button>
      </div>
      {loading ? (
        <CircularProgress color="inherit" className="absolute inset-0 m-auto" />
      ) : (
        <div style={{ height: "auto", width: "95%", margin: "0 auto" }}>
          <DataGrid
            rows={rowsData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            checkboxSelection
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
