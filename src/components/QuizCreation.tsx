"use client";
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import {useForm} from 'react-hook-form'
import { quizCreationSchema } from '@/schemas/form/quiz'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { Form, FormField, FormLabel, FormItem, FormControl, FormDescription, FormMessage} from './ui/form'
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BookOpen, CopyCheck } from 'lucide-react';
import { Separator } from './ui/separator';
import {useMutation} from '@tanstack/react-query'
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import LoadingQuestions from './LoadingQuestions';

type Props = {
  topicParam : string
}

type Input = z.infer<typeof quizCreationSchema>

const QuizCreation = ({topicParam}: Props) => {
  const router = useRouter()
  const [showLoader , setShowLoader] = useState(false);
  const [finished , setFinished] = useState(false);
  const {mutate: getQuestions, isPending} = useMutation({
    mutationFn: async ({amount, topic, type} : Input) => {
      const response = await axios.post('/api/game', {
        amount,
        topic, 
        type,
      });
      return response.data
    }
  })  
  const form = useForm<Input>({
      resolver: zodResolver(quizCreationSchema),
      defaultValues: {
        topic: topicParam,
        type: "mcq",
        amount:3, 
      }
    });

    function onSubmit (input : Input) {
      setShowLoader(true);
      getQuestions({
        amount:input.amount,
        topic:input.topic,
        type:input.type,
      }, {
        onSuccess: ({gameId}) => {
          setFinished(true);
          setTimeout(()=>{
          if (form.getValues('type') == 'open_ended'){
            router.push(`/play/open-ended/${gameId}`)
          } 
          else{
            router.push(`/play/mcq/${gameId}`)
          }}, 1000);
        },
        onError: () =>{
          setShowLoader(false);
        }
      })
    }

    form.watch() //to rerender the form everytime quiz type slider is clicked(mcq, open_ended selector)
    if (showLoader){
      return <LoadingQuestions finished={finished}/>
    }
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card className=''>
        <CardHeader>
        <CardTitle className='text-2xl font-bold'>Quiz Creation</CardTitle>
        <CardDescription>Select a topic and we'll quiz you on it!!</CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name = 'topic'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder="Enter a topic.." {...field} />
              </FormControl>
              <FormDescription>
          
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name = 'amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Questions</FormLabel>
              <FormControl>
                <Input placeholder="" 
                {...field} 
                type='number'
                min={1}
                max={10}
                onChange={(e) => {
                  form.setValue('amount', parseInt(e.target.value));
                }}/>
              </FormControl>
              <FormDescription>
          
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-between'>
          <Button 
          type='button'
          onClick = {() =>{
            form.setValue('type', 'mcq')}
          }
          className='w-1/2 rounded-none rounded-l-lg' 
          variant= {form.getValues('type') === 'mcq' ? 'default':'secondary'}
          >
            <CopyCheck className='w-4 h-4 mr-2' /> Multiple Choice
          </Button>
          <Separator orientation='vertical'/>
          <Button
          type='button' 
          onClick = {() =>{
            form.setValue('type', 'open_ended')}
          } 
          className='w-1/2 rounded-none rounded-r-lg'
          variant= {form.getValues('type') === 'open_ended' ? 'default':'secondary'}
          >
            <BookOpen className='w-4 h-4 mr-2' /> Open Ended
          </Button>
        </div>
        <Button disabled={isPending} type="submit">Submit</Button>
      </form>
      </Form>
     </CardContent>
      </Card>
    </div>
  )
}

export default QuizCreation