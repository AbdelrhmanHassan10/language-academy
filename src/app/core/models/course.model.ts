// ── Courses List ──

export interface CourseCategory {
  slug: string;
  name: string;
}

export interface CourseListItem {
  id: number;
  name: string;
  cover_image: string;
  level: string;
  level_translated: string;
  description: string;
  duration_days: string;
  price: string;
  available_seats: number;
  category: CourseCategory;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface CoursesListResponse {
  success: boolean;
  message: string;
  data: CourseListItem[];
  pagination: Pagination;
}

// ── Course Details ──

export interface CourseBasicInfo {
  name: string;
  instructor_name: string;
  price: string;
  duration: string;
  start_date: string;
  end_date: string;
}

export interface CourseTopic {
  title: string;
  description: string;
  hours: number;
  sort_order: number;
}

export interface CourseSchedule {
  lecture_date: string;
  time_range: string;
}

export interface CourseLocation {
  ar: string;
  en: string;
}

export interface CourseExtraDetails {
  level: string;
  language: string;
  max_students: number;
  registration_deadline: string;
  location: CourseLocation;
}

export interface CourseDetails {
  basic_info: CourseBasicInfo;
  description: string;
  topics: CourseTopic[];
  schedules: CourseSchedule[];
  extra_details: CourseExtraDetails;
}

export interface CourseDetailsResponse {
  success: boolean;
  message: string;
  data: CourseDetails;
}
