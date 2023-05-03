// const sql = require('../../config/database.config');
var oracledb = require("oracledb");
const config = require("../../config/database.connection");

let conn;
let result;

async function getHTRDT(instrument) {
  try {
    conn = await oracledb.getConnection(config);
    result = await conn.execute(
      "SELECT HeatID, TreatID, SampleNo, Plant, PlantNo, TimeOfAnalysis FROM HeatTestResultDataTable where (Transmit=1) and MachineName= :instr_name ORDER BY TimeOfAnalysis desc FETCH NEXT 50 ROWS ONLY",
      { instr_name: instrument }
    );
    console.log(result);
    const Result = result.rows;
    return Result;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing database connection", err);
      }
    }
  }
}

async function getHTRDTByHeatNo(instrument, heatid) {
  try {
    // const k=heatid+'%';
    conn = await oracledb.getConnection(config);
    result = await conn.execute(
      `SELECT HeatID, TreatID, SampleNo, Plant, PlantNo, TimeOfAnalysis
        FROM HeatTestResultDataTable where (Transmit=1) and MachineName= :instr_name and HEATID= :heat_id 
        ORDER BY TimeOfAnalysis desc FETCH NEXT 50 ROWS ONLY`,
      { instr_name: instrument, heat_id: heatid }
    );
    console.log(result);
    const Result = result.rows;
    return Result;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing database connection", err);
      }
    }
  }
}

async function getHTRDTByTime(instrument, fromTime, toTime) {
  try {
    conn = await oracledb.getConnection(config);
    result = await conn.execute(
      `SELECT HeatID, TreatID, SampleNo, Plant, PlantNo, TimeOfAnalysis 
        FROM HeatTestResultDataTable where (Transmit=1) and MachineName= :instr_name 
        and TimeOfAnalysis >= :from_Time and TimeOfAnalysis <= :to_Time 
        ORDER BY TimeOfAnalysis desc FETCH NEXT 50 ROWS ONLY`,
      { instr_name: instrument, from_Time: fromTime, to_Time: toTime }
    );
    console.log(result);
    const Result = result.rows;
    return Result;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing database connection", err);
      }
    }
  }
}

async function getinstruHTRDTs1(instrument, heatid, treatid, sampleno) {
  try {
    conn = await oracledb.getConnection(config);
    let query;
    switch (instrument) {
      case "SPECTRO1":
        query = `select H.HeatID,H.SampleNo,H.TreatID,H.TimeOfAnalysis,H.Plant,H.PlantNo,H.Grade,H.SampleType,H.LadleNo,
                V.C,V.Mn,V.Si,V.S,V.P,V.Ni,V.Cr,V.Mo,V.Cu,V.Sn,V.Al,V.Al_S,V.SP1,V.Ti,V.B,V.V,V.Nb,V.Sb,V.Pb,V.W,V.Ca,V.N,V.Fe,V.B_S,V.B_Oxy,V.SP2,V.SP3 
                from HeatTestResultDataTable H inner join TESTRESULTSPECTRO1 V
                on H.HeatID=V.HeatID and H.SampleNo=V.SampleNo and H.TreatID=V.TreatID 
                where (H.MachineName= :instr_name and H.HeatID= :HeatNo and H.TreatId= :TreatId and H.SampleNo= :SampleId)`;
        break;

      case "SPECTRO2":
        query = `select H.HeatID,H.SampleNo,H.TreatID,H.TimeOfAnalysis,H.Plant,H.PlantNo,H.Grade,H.SampleType,H.LadleNo,
                V.C,V.Mn,V.Si,V.S,V.P,V.Ni,V.Cr,V.Mo,V.Cu,V.Sn,V.Al,V.Al_S,V.SP1,V.Ti,V.B,V.V,V.Nb,V.Sb,V.Pb,V.W,V.Ca,V.N,V.Fe,V.B_S,V.B_Oxy,V.SP2,V.SP3 
                from HeatTestResultDataTable H inner join TESTRESULTSPECTRO2 V
                on H.HeatID=V.HeatID and H.SampleNo=V.SampleNo and H.TreatID=V.TreatID 
                where (H.MachineName= :instr_name and H.HeatID= :HeatNo and H.TreatId= :TreatId and H.SampleNo= :SampleId)`;
        break;

      case "SPECTRO3":
        query = `select H.HeatID,H.SampleNo,H.TreatID,H.TimeOfAnalysis,H.Plant,H.PlantNo,H.Grade,H.SampleType,H.LadleNo,
                V.C,V.Mn,V.Si,V.S,V.P,V.Ni,V.Cr,V.Mo,V.Cu,V.Sn,V.Al,V.Al_S,V.SP1,V.Ti,V.B,V.V,V.Nb,V.Sb,V.Pb,V.W,V.Ca,V.N,V.Fe,V.B_S,V.B_Oxy,V.SP2,V.SP3 
                from HeatTestResultDataTable H inner join TESTRESULTSPECTRO3 V
                on H.HeatID=V.HeatID and H.SampleNo=V.SampleNo and H.TreatID=V.TreatID 
                where (H.MachineName= :instr_name and H.HeatID= :HeatNo and H.TreatId= :TreatId and H.SampleNo= :SampleId)`;
        break;

      case "BOFCLAB":
        query = `select H.HeatID,H.SampleNo,H.TreatID,H.TimeOfAnalysis,H.Plant,H.PlantNo,H.Grade,H.SampleType,H.LadleNo,
                V.C,V.Mn,V.Si,V.S,V.P,V.Ni,V.Cr,V.Mo,V.Cu,V.Sn,V.Al,V.Al_S,V.SP1,V.Ti,V.B,V.V,V.Nb,V.Sb,V.Pb,V.W,V.Ca,V.N,V.Fe,V.B_S,V.B_Oxy,V.SP2,V.SP3 
                from HeatTestResultDataTable H inner join TESTRESULTBOFCLAB V
                on H.HeatID=V.HeatID and H.SampleNo=V.SampleNo and H.TreatID=V.TreatID 
                where (H.MachineName= :instr_name and H.HeatID= :HeatNo and H.TreatId= :TreatId and H.SampleNo= :SampleId)`;
        break;
    }
    result = await conn.execute(query, {
      instr_name: instrument,
      HeatNo: heatid,
      TreatId: treatid,
      SampleId: sampleno,
    });
    console.log(result);
    const Result = result.rows;
    return Result;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing database connection", err);
      }
    }
  }
}

async function getinstruHTRDTs2(heatid, sampleno, treatid) {
  try {
    conn = await oracledb.getConnection(config);
    result = await conn.execute(
      `select H.HeatID,H.SampleNo,H.TreatID,H.TimeOfAnalysis,H.Plant,H.PlantNo,H.Grade,H.SampleType,H.LadleNo,V.H,V.N,V.O  from HeatTestResultDataTable H inner join  
            TestResultLECO1  V on H.HeatID=V.HeatID 
            and H.SampleNo=V.SampleNo 
            and H.TreatID=V.TreatID
        where (H.MachineName='LECO1' and H.HeatID= :HeatNo 
        and H.SampleNo= :SampleId and H.TreatID=:TreatId)`,
      { HeatNo: heatid, SampleId: sampleno, TreatId: treatid },
      { outFormat: oracledb.OBJECT }
    );

    const Result = result.rows;
    return Result;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing database connection", err);
      }
    }
  }
}

async function getinstruHTRDTs3(instrument, heat_id, treat_id, sample_no) {
  try {
    conn = await oracledb.getConnection(config);
    let query;
    switch (instrument) {
      case "LECO2":
        query = `select H.HeatID,H.SampleNo,H.TreatID,H.TimeOfAnalysis,H.Plant,H.PlantNo,H.Grade,H.SampleType,H.LadleNo, 
                V.C,V.S from HeatTestResultDataTable H inner join  TestResultLECO2 V 
                on H.HeatID=V.HeatID and H.SampleNo=V.SampleNo and H.TreatID=V.TreatID where 
                (H.MachineName= :instr_name and H.HeatID= :HeatNo and H.TreatId= :TreatId and H.SampleNo= :SampleId)`;
        break;

      case "LECO3":
        query = `select H.HeatID,H.SampleNo,H.TreatID,H.TimeOfAnalysis,H.Plant,H.PlantNo,H.Grade,H.SampleType,H.LadleNo, 
                V.C,V.S from HeatTestResultDataTable H inner join  TestResultLECO3 V 
                on H.HeatID=V.HeatID and H.SampleNo=V.SampleNo and H.TreatID=V.TreatID where 
                (H.MachineName= :instr_name and H.HeatID= :HeatNo and H.TreatId= :TreatId and H.SampleNo= :SampleId)`;
        break;
    }
    result = await conn.execute(query, {
      instr_name: instrument,
      HeatNo: heat_id,
      SampleId: sample_no,
      TreatId: treat_id,
    });
    console.log(result);
    const Result = result.rows;
    return Result;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing database connection", err);
      }
    }
  }
}

async function getinstruHTRDTs4(instrument, heat_id, treat_id, sample_no) {
  try {
    conn = await oracledb.getConnection(config);
    let query;
    switch (instrument) {
      case "XRF1":
        query = `select H.HeatID,H.SampleNo,H.TreatID,H.TimeOfAnalysis,H.Plant,H.PlantNo,H.Grade,H.SampleType,H.LadleNo,
                V.CaO,V.Si_O2,V.P2_O5,V.FeO,V.Fe2_O3,V.Fe3_O4,V.S,V.Al2_O3,V.MgO,V.MnO,V.Cr2_O3,
                V.MoO,V.NiO,V.V2_O5,V.Ti_O2,V.Ti_Fe,V.Ca_C2,V.Ca_F2,V.CaS,V.Fe,V.SP1,V.SP2,V.SP3,
                V.SP4,V.SP5,V.SP6,V.SP7,V.SP8,V.SP9,V.SP10 
                from HeatTestResultDataTable H inner join TESTRESULTXRF1 V on H.HeatID=V.HeatID and H.SampleNo=V.SampleNo and H.TreatID=V.TreatID 
                where (H.MachineName= :instr_name and H.HeatID= :HeatNo and H.TreatId= :TreatId and H.SampleNo= :SampleId)`;
        break;

      case "XRF2":
        query = `select H.HeatID,H.SampleNo,H.TreatID,H.TimeOfAnalysis,H.Plant,H.PlantNo,H.Grade,H.SampleType,H.LadleNo,
                V.CaO,V.Si_O2,V.P2_O5,V.FeO,V.Fe2_O3,V.Fe3_O4,V.S,V.Al2_O3,V.MgO,V.MnO,V.Cr2_O3,
                V.MoO,V.NiO,V.V2_O5,V.Ti_O2,V.Ti_Fe,V.Ca_C2,V.Ca_F2,V.CaS,V.Fe,V.SP1,V.SP2,V.SP3,
                V.SP4,V.SP5,V.SP6,V.SP7,V.SP8,V.SP9,V.SP10 
                from HeatTestResultDataTable H inner join TestResultXRF2 V on H.HeatID=V.HeatID and H.SampleNo=V.SampleNo and H.TreatID=V.TreatID 
                where (H.MachineName= :instr_name and H.HeatID= :HeatNo and H.TreatId= :TreatId and H.SampleNo= :SampleId)`;
        break;
    }
    result = await conn.execute(query, {
      instr_name: instrument,
      HeatNo: heat_id,
      SampleId: sample_no,
      TreatId: treat_id,
    });
    console.log(result);
    const Result = result.rows;
    return Result;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing database connection", err);
      }
    }
  }
}

module.exports = {
  getHTRDT,
  getHTRDTByHeatNo,
  getHTRDTByTime,
  getinstruHTRDTs1,
  getinstruHTRDTs2,
  getinstruHTRDTs3,
  getinstruHTRDTs4,
};
