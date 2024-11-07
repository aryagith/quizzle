'use client';
import { useTheme } from 'next-themes'
import React from 'react'
import D3WordCloud from 'react-d3-cloud'

type Props = {
}

const data = [
    // {
    //     text: "Thank you!",
    //     value: 3,
    // },
    // {
    //     text: 'Until then check out the "Quiz Me!" tab!',
    //     value: 5,
    // },
    {
        text: "This feature is coming soon!!",
        value: 10,
    },
    // {
    //     text: "This feature is coming soon!!",
    //     value: 2,
    // },
]

const fontSizeMapper = (word:{ value: number}) => {
    return Math.log2(word.value)*6 + 10;
}

const isSystemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const CustomWordCloud = (props: Props) => {
    const theme = useTheme();
    return (
    <>
    <D3WordCloud 
    height={650}
    font="Ariel"
    fontSize={fontSizeMapper}
    rotate={0}
    padding={10}
    fill={theme.theme === "dark" || (theme.theme === "system" && isSystemDarkMode) ? "white" : "black"}
    data={data}
    />
    </>
  )
}

export default CustomWordCloud