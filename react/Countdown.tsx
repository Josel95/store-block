import React, { useState } from 'react'
import { TimeSplit } from './typings/global'
import { tick } from './utils/time'
import { useCssHandles } from 'vtex.css-handles'
import { useQuery } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'
import productReleaseDate from './queries/productReleaseDate.graphql'

const CSS_HANDLES = ["countdown", "countdown", "title"]

const DEFAULT_TARGET_DATE = (new Date('2020-06-25')).toISOString()

interface CountdownProps {}

const Countdown: StorefrontFunctionComponent<CountdownProps> = () => {
  
  const handles = useCssHandles(CSS_HANDLES)
  
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  const {product: { linkText }} = useProduct()
  
  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: linkText
    },
    ssr: false
  })

  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)

  if(loading){
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }

  if(error) {
    return (
      <div>
        <span>Error!</span>
      </div>
    )
  }

  return (
    <div className={`${handles.countdown} t-heading-2 fw3 w-100 c-muted-1 db tc`}>
      { `${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}` }
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
      title: "Final Date",
      description: "Final date used in countdown",
      type: 'string',
      default: null,
    },
  },
}

export default Countdown
