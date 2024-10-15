import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Card'

type Props = {}

function RecentActivities({}: Props) {
  return (
    <Card className='col-span-4 lg:col-span-3'>
         <CardHeader>
            <CardTitle className='text-2xl font-bold'>Recent Activity</CardTitle>
            <CardDescription>
                You have played a total of 7 games.
            </CardDescription>
         </CardHeader>
         <CardContent className='max-h-[580px] overflow-scroll'>
            Histories
         </CardContent>
    </Card>
  )
}

export default RecentActivities