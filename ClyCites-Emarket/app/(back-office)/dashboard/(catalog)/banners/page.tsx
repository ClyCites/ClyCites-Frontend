import PageHeader from '@/components/backoffice/PageHeader'
import React from 'react'
import TableActions from '../../../../../components/backoffice/TableActions'

export default function Banner() {
  return (
    <div>
      {/* Header  */}
       <PageHeader heading="Banners" href="/dashboard/banners/new" linkTitle="Add Banner"/>
      {/* Table */}

      {/* Export search bulk  */}
      <TableActions />
      <div className="py-8">
      <h2>Table</h2>
      </div>
    </div>
  )
}
