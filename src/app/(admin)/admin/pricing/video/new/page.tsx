import VideoPackageForm from '../VideoPackageForm'

export const metadata = { title: 'New Video Package — KTI Admin' }

export default function NewVideoPackagePage() {
  return <VideoPackageForm initialData={null} />
}
