'use client';
import { useTheme } from 'next-themes'
import React from 'react'
import D3WordCloud from 'react-d3-cloud'

type Props = {
    formattedTopics: {text :string; value: number}[];  
}

const fontSizeMapper = (word:{ value: number}) => {
    return Math.log2(word.value)*6 + 10;
}

const isSystemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

const CustomWordCloud = ( {formattedTopics}: Props) => {
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
    data={formattedTopics}
    />
    </>
  )
}

export default CustomWordCloud