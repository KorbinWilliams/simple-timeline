import React, {useState, useEffect, useRef} from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Grid } from '@mui/material'
import TimelineChart from "../timeline/main";

const MainDisplay = (props) => {
  const ref = useRef(0)

  let testItems = [
    {
      name: 'Bob',
      // 07:30 - 8:00
      // appointmentStart: new Date(1669732200000),
      // appointmentEnd: new Date(1669734000000)
      appointmentStart: 1669732200000,
      appointmentEnd: 1669734000000,
      visitReason: 'check-up'
    },
    {
      name: 'Alena',
      // 06:15 - 7:45
      // appointmentStart: new Date(1669727700000),
      // appointmentEnd: new Date(1669733100000)
      appointmentStart: 1669727700000,
      appointmentEnd: 1669733100000,
      visitReason: 'colonoscopy'
    },
    {
      name: 'Joseph',
      // 15:45 - 16:45
      // appointmentStart: new Date(1669761900000),
      // appointmentEnd: new Date(1669765500000)
      appointmentStart: 1669761900000,
      appointmentEnd: 1669765500000,
      visitReason: 'diabetes consultation'
    },
    {
      name: 'Stephanie',
      // 12:00 - 12:42
      // appointmentStart: new Date(1669748400000),
      // appointmentEnd: new Date(1669750920000)
      appointmentStart: 1669748400000,
      appointmentEnd: 1669750920000,
      visitReason: 'physical exam'
    },
    {
      name: 'Ricardo',
      // 14:30 - 15:35
      // appointmentStart: new Date(1669757400000),
      // appointmentEnd: new Date(1669761300000)
      appointmentStart: 1669757400000,
      appointmentEnd: 1669761300000,
      visitReason: 'ultrasound & MRI'
    },
    {
      name: 'Jhon',
      // 10:15 - 11:00
      // appointmentStart: new Date(1669742100000),
      // appointmentEnd: new Date(1669744800000)
      appointmentStart: 1669742100000,
      appointmentEnd: 1669744800000,
      visitReason: 'adhd follow-up'
    }
  ]

  const formatAppointments = (aptsArr) => {
    console.log(`aptsArr:`, aptsArr)
    for (let i = 0; i < aptsArr.length; i++) {
      let apt = aptsArr[i];
      // console.log('start: ', new Date(apt.appointmentStart).toISOString(), ' end: ', new Date(apt.appointmentEnd).toISOString())
      console.log(apt.name, apt.appointmentEnd - apt.appointmentStart)
      apt.label = [
        {
          text: [`${apt.visitReason}`],
          styles: [{fontWeight: 'bold'}]
        }
      ]
      // {
      //   text: [`${flight.Load}`,`${hasStandbyPax ? `STBY` : ''}`, `${hasStandbyPax ?  `(${hasStandbyPax.length})` : ''}`],
      //   styles: [{}, {fontWeight: 'bold', marginLeft: '3px', marginRight: '3px', color: '#bb0000'}, {}]
      // },
    }
    return aptsArr
  }

  // TODO // simplify starting chart (add more default options, enable more types for css options)
  // TODO // make it so label has a default using text from label property

  return (
    <Grid container item xs={12} ref={ref}>
      <TimelineChart
        items={formatAppointments(testItems)}
        // Nov 29 2022 00:00:00
        timelineDate={1669705200000}
        timelineStart={5}
        timelineEnd={23}
        showCurrentTime={true}
        dateItemsLoc={['appointmentStart', 'appointmentEnd']}
        vAxisProp={'name'}
        chartHeight={'600px'}
        chartWidth={1500}
        itemOptions={
          {
            defaultColor: '#9fc5e9',
            // itemStyle: {height: '64px', top: '25%', fontFamily: 'Helvetica'}
            // colorIf: getItemColor,
            // hover: 'hoverHtml'
          }
        }
        labelOptions={
          {
            label: 'label'
          }
        }
        // itemModal = {
        //   {
        //     component: <TestModal />
        //   }
        // }
      />
    </Grid>
  )
}

export default MainDisplay