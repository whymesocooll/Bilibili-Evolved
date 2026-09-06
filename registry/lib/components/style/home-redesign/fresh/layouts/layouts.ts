import { registerAndGetData } from '@/plugins/data'
import { areas } from './areas/areas'
import { blackboard } from './blackboard/blackboard'
import { categories } from './categories/categories'
import { videos } from './videos/videos'

const builtInLayouts = [blackboard, videos, areas, categories]
export const [layouts] = registerAndGetData('homeRedesign.fresh.layouts', [...builtInLayouts])
