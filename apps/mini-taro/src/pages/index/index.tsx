import { FC, useEffect, useMemo, useState } from 'react'
import { View, Text, Button, Slider, Textarea } from '@tarojs/components'
import './index.scss'
import Taro from '@tarojs/taro'
import { httpGet, httpPost } from '@/utils/http'
import { ICategory } from '@/mini-taro/typings/index'

const OPTION_TAGS = [
  { key: 'warm', label: '语气更热情' },
  { key: 'photo', label: '提到拍照好看' },
  { key: 'value', label: '强调性价比' },
]

const Profile: FC = () => {
  const [category, setCategory] = useState<number>()
  const [limit, setLimit] = useState(150)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [result, setResult] = useState('')

  const [categoryList, setCategoryList] = useState<ICategory[]>([])
  useEffect(() => {
    httpGet('/api/category').then(res => {
      // console.log(res)
      const result = res.slice(0,8) as ICategory[];
      // console.log(result)
      setCategory(res[0]?.id || [])
      setCategoryList(result|| [])
    })
  },[])
  const handleToggleOption = (key: string) => {
    setSelectedOptions(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }
  
  const hintText = useMemo(() => {
    return '点击下方按钮，生成在大众点评上的完美好评…'
  }, [])

  const buildReview = () => {
    const catLabel = categoryList.find(c => c.id === category)?.name || '美食'
    httpPost('/api/comment', {
      words:limit,
      categoryName:catLabel,
      categoryId:category,
    }).then(res=>{
      console.log(res)
      setResult(res.text)
    })
  
  }
const goAllCategory =()=>{
  Taro.navigateTo({
    url: '/pages/allCategory/index'
  })
}
  return (
    <View className='profile-page'>
      <View className='section'>
        <View className='section-header'>
          <View className='section-title'>选择类别</View>
          <Text className='section-more' onClick={()=>goAllCategory()}>查看更多</Text>
        </View>
        <View className='category-grid'>
          {categoryList.map(item => (
            <View
              key={item.id}
              className={`category-item ${category === item.id ? 'active' : ''}`}
              onClick={() => setCategory(item.id)}
            >
              <View className={`icon-circle ${category === item.id ? 'active' : ''}`}>
                <Text className='icon'>{item.icon}</Text>
              </View>
              <Text className={`label ${category === item.id ? 'active' : ''}`}>{item.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='divider' />

      <View className='section'>
        <View className='section-header'>
          <View className='section-title'>字数限制</View>
          <Text className='limit-highlight'>{limit}字左右</Text>
        </View>
        <Slider
          min={50}
          max={300}
          step={1}
          value={limit}
          onChange={(e) => setLimit(Number(e.detail.value))}
        />
      </View>

      <View className='section'>
        <View className='section-header'>
          <View className='section-title'>生成结果</View>
          <Text className='copy-hint'>📋 复制</Text>
        </View>
        <View className='result-box'>
          <Textarea
            className='result-textarea'
            value={result}
            placeholder={hintText}
            maxlength={300}
            showConfirmBar={false}
            autoHeight
          />
        </View>
      </View>

      <View className='options'>
        {OPTION_TAGS.map(opt => (
          <View
            key={opt.key}
            className={`option-tag ${selectedOptions.includes(opt.key) ? 'checked' : ''}`}
            onClick={() => handleToggleOption(opt.key)}
          >
            <Text>{opt.name}</Text>
          </View>
        ))}
      </View>

      <View className='footer'>
        <Button className='generate-btn' onClick={buildReview}>✨ 生成好评</Button>
      </View>
    </View>
  )
}

export default Profile
