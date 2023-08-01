import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { CircularProgress, TextField, Button } from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import GradingIcon from "@mui/icons-material/Grading";
const Table = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 3);
  const initToDate = date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
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
  const [statusChanged, setStatusChanged] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const url = `https://clguat.nablasol.net/rest/v11_1/getAchPayments?from_date=${fromDate}&to_date=${toDate}`;
      const res = await axios.get(url);
      console.log(res.data);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    setStatusChanged(false);
  }, [statusChanged]);

  // const handleActionClick = async (id) => {
  //   const url = `https://clguat.nablasol.net/rest/v11_1/updateAchPayments?pid='${id}'&collection_status=1`;
  //   console.log(url);
  //   try {
  //     const res = await axios.get(url);
  //     if (res.status === 200) {
  //       alert("Success !");
  //       setStatusChanged(true);
  //     }
  //   } catch (error) {
  //     setShowalert(false);
  //     alert("Failed!");
  //     console.log(error);
  //   }
  // };

  const handleActionClick = async (id, collection_status) => {
    // Show the SweetAlert dialog
    const result = await Swal.fire({
      title: "Confirm Payment Review",
      text: "Are you sure you want to mark this payment as reviewed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      // If the user clicks "Confirm," make the API call
      const url = `https://clguat.nablasol.net/rest/v11_1/updateAchPayments?pid='${id}'&collection_status=1`;
      console.log(url);
      console.log(collection_status);
      try {
        const res = await axios.get(url);
        if (res.status === 200) {
          setStatusChanged(true); // Update the state variable to trigger re-render
        }
      } catch (error) {
        setShowalert(false);
        alert("Failed!");
        console.log(error);
      }
    }
  };

  const handleFilterClick = () => {
    fetchData(); // Fetch data when the filter button is clicked
    setFromDate("");
    setToDate("");
  };

  // const getSelectedAmountSum = () => {
  //   let sum = 0;
  //   for (const id of selectionModel) {
  //     const selectedRow = data.find((row) => row.payment_id === id);
  //     if (selectedRow) {
  //       sum += parseFloat(selectedRow.amount);
  //     }
  //   }
  //   return sum.toFixed(2);
  // };

  const getSelectedAmountSum = () => {
    let sum = 0;
    for (const id of rowSelectionModel) {
      const selectedRow = data.find((row) => row.id === id);
      if (selectedRow) {
        sum += parseFloat(selectedRow.amount);
      }
    }
    return sum.toFixed(2);
  };

  const rowsData = data.map((row) => {
    return {
      id: row.payment_id,
      lead_id: row.lead_id,
      name: row.name,
      collected_amount: `$${parseInt(row.amount)}`,
      collected_date: row.payment_date,
      collected_by: row.collected_by || "NA",
      payment_mode: row.payment_mode,
      collection_status: row.collection_status ? row.collection_status : "NA",
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
      field: "collection_status",
      headerName: "REVIEW STATUS",
      width: 150,
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex flex-row justify-between gap-2">
          {params.row.collection_status === "NA" ||
          params.row.collection_status === null ? (
            <button
              onClick={() =>
                handleActionClick(params.row.id, params.row.collection_status)
              }
              className="bg-black rounded"
            >
              <GradingIcon className="text-white" />
            </button>
          ) : (
            <p className="text-green-500 font-bold bg-review-color p-1 rounded">
              Reviewed
            </p>
          )}

          {/* <button
            onClick={() => handleActionClick(params.row.id, "reject")}
            className="bg-black rounded"
          >
            <ClearIcon className="text-white" />
          </button> */}
        </div>
      ),
    },
  ];
  console.log(rowSelectionModel);
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
          <div className="selected-amount-sum">
            Selected Amount{getSelectedAmountSum()}
          </div>
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
            disableSelectionOnClick
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
