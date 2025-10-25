import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import BjpGovernmentSatisfactionChart from './Components/BjpGovernmentSatisfactionChart'
import CooperativeSchemesAwareness from './Components/CooperativeSchemesAwareness'
import EconomicStatusChart from './Components/EconomicStatusChart'
import MinisterReachImpactChart from './Components/MinisterReachImpactChart'
import MinisterYearPerformanceChart from './Components/MinisterYearPerformanceChart'
import SchemeSpendingAndSavingChart from './Components/SchemeInfoMediumChart'

function App() {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadPDF = async () => {
    if (!contentRef.current) return
    
    setIsDownloading(true)
    
    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const pageHeight = 295
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save('vandan-yojana-report.pdf')
    setIsDownloading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
        >
          {isDownloading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Downloading...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </>
          )}
        </button>
      </div>
      
      <div ref={contentRef} className="p-4 space-y-8">
        <EconomicStatusChart/>
        <SchemeSpendingAndSavingChart/>
        <MinisterReachImpactChart/>
        <MinisterYearPerformanceChart/>
        <CooperativeSchemesAwareness/>
        <BjpGovernmentSatisfactionChart/>
      </div>
    </div>
  )
}

export default App