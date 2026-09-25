import React from 'react';
import { useModal } from '../context/ModalContext';

// Import Modals as they are implemented
import Modal2A_LateAbsence from './page2/Modal2A_LateAbsence';
import Modal2B_PdfReport from './page2/Modal2B_PdfReport';
import Modal2C_LiveLogs from './page2/Modal2C_LiveLogs';
import Modal3A_OtRegister from './page3/Modal3A_OtRegister';
import Modal3B_NoticeDetail from './page3/Modal3B_NoticeDetail';
import Modal3C_PayslipPdf from './page3/Modal3C_PayslipPdf';
import Modal3D_Handbook from './page3/Modal3D_Handbook';
import Modal4A_Onboarding from './page4/Modal4A_Onboarding';
import Modal4B_Profile360 from './page4/Modal4B_Profile360';
import Modal4C_ImportExcel from './page4/Modal4C_ImportExcel';
import Modal4D_Offboarding from './page4/Modal4D_Offboarding';
import Modal4E_DepartmentManage from './page4/Modal4E_DepartmentManage';
import Modal4F_JobTitleManage from './page4/Modal4F_JobTitleManage';
import Modal4G_ContractPdfPreview from './page4/Modal4G_ContractPdfPreview';
import Modal5A_KioskGate from './page5/Modal5A_KioskGate';
import Modal5B_TimesheetMatrix from './page5/Modal5B_TimesheetMatrix';
import Modal5C_SnapshotLogs from './page5/Modal5C_SnapshotLogs';
import Modal6A_LeaveCalendar from './page6/Modal6A_LeaveCalendar';
import Modal6B_MedicalClaim from './page6/Modal6B_MedicalClaim';
import Modal6C_RejectionWorkflow from './page6/Modal6C_RejectionWorkflow';
import Modal6D_CreateLeaveRequest from './page6/Modal6D_CreateLeaveRequest';
import Modal6E_LeaveDetailView from './page6/Modal6E_LeaveDetailView';
import Modal7A_PayrollAnomaly from './page7/Modal7A_PayrollAnomaly';
import Modal7B_BankTransfer from './page7/Modal7B_BankTransfer';
import Modal7C_PayrollLock from './page7/Modal7C_PayrollLock';
import Modal8A_TurnoverRisk from './page8/Modal8A_TurnoverRisk';
import Modal8B_AiCopilotDrawer from './page8/Modal8B_AiCopilotDrawer';
import Modal8C_PipPlan from './page8/Modal8C_PipPlan';
import Modal8D_NineBoxDetail from './page8/Modal8D_NineBoxDetail';
import Modal_NotificationCenter from './common/Modal_NotificationCenter';
import Modal_NotificationDetailPopup from './common/Modal_NotificationDetailPopup';

export default function ModalContainer() {
  const { activeModal, closeModal, modalPayload } = useModal();

  if (!activeModal) return null;

  return (
    <>
      {/* Global Notification Modals */}
      <Modal_NotificationCenter isOpen={activeModal === 'modalNotificationCenter'} onClose={closeModal} payload={modalPayload} />
      <Modal_NotificationDetailPopup isOpen={activeModal === 'modalNotificationDetail'} onClose={closeModal} payload={modalPayload} />
      {/* Page 2 Modals */}
      <Modal2A_LateAbsence isOpen={activeModal === 'modal2A'} onClose={closeModal} payload={modalPayload} />
      <Modal2B_PdfReport isOpen={activeModal === 'modal2B'} onClose={closeModal} payload={modalPayload} />
      <Modal2C_LiveLogs isOpen={activeModal === 'modal2C'} onClose={closeModal} payload={modalPayload} />

      {/* Page 3 Modals */}
      <Modal3A_OtRegister isOpen={activeModal === 'modal3A'} onClose={closeModal} payload={modalPayload} />
      <Modal3B_NoticeDetail isOpen={activeModal === 'modal3B'} onClose={closeModal} payload={modalPayload} />
      <Modal3C_PayslipPdf isOpen={activeModal === 'modal3C'} onClose={closeModal} payload={modalPayload} />
      <Modal3D_Handbook isOpen={activeModal === 'modal3D'} onClose={closeModal} payload={modalPayload} />

      {/* Page 4 Modals */}
      <Modal4A_Onboarding isOpen={activeModal === 'modal4A'} onClose={closeModal} payload={modalPayload} />
      <Modal4B_Profile360 isOpen={activeModal === 'modal4B'} onClose={closeModal} payload={modalPayload} />
      <Modal4C_ImportExcel isOpen={activeModal === 'modal4C'} onClose={closeModal} payload={modalPayload} />
      <Modal4D_Offboarding isOpen={activeModal === 'modal4D'} onClose={closeModal} payload={modalPayload} />
      <Modal4E_DepartmentManage isOpen={activeModal === 'modal4E'} onClose={closeModal} payload={modalPayload} />
      <Modal4F_JobTitleManage isOpen={activeModal === 'modal4F'} onClose={closeModal} payload={modalPayload} />
      <Modal4G_ContractPdfPreview isOpen={activeModal === 'modal4G'} onClose={closeModal} payload={modalPayload} />

      {/* Page 5 Modals */}
      <Modal5A_KioskGate isOpen={activeModal === 'modal5A'} onClose={closeModal} payload={modalPayload} />
      <Modal5B_TimesheetMatrix isOpen={activeModal === 'modal5B'} onClose={closeModal} payload={modalPayload} />
      <Modal5C_SnapshotLogs isOpen={activeModal === 'modal5C'} onClose={closeModal} payload={modalPayload} />

      {/* Page 6 Modals */}
      <Modal6A_LeaveCalendar isOpen={activeModal === 'modal6A'} onClose={closeModal} payload={modalPayload} />
      <Modal6B_MedicalClaim isOpen={activeModal === 'modal6B'} onClose={closeModal} payload={modalPayload} />
      <Modal6C_RejectionWorkflow isOpen={activeModal === 'modal6C'} onClose={closeModal} payload={modalPayload} />
      <Modal6D_CreateLeaveRequest isOpen={activeModal === 'modal6D'} onClose={closeModal} payload={modalPayload} />
      <Modal6E_LeaveDetailView isOpen={activeModal === 'modal6E'} onClose={closeModal} payload={modalPayload} />

      {/* Page 7 Modals */}
      <Modal7A_PayrollAnomaly isOpen={activeModal === 'modal7A'} onClose={closeModal} payload={modalPayload} />
      <Modal7B_BankTransfer isOpen={activeModal === 'modal7B'} onClose={closeModal} payload={modalPayload} />
      <Modal7C_PayrollLock isOpen={activeModal === 'modal7C'} onClose={closeModal} payload={modalPayload} />

      {/* Page 8 Modals */}
      <Modal8A_TurnoverRisk isOpen={activeModal === 'modal8A'} onClose={closeModal} payload={modalPayload} />
      <Modal8B_AiCopilotDrawer isOpen={activeModal === 'modal8B'} onClose={closeModal} payload={modalPayload} />
      <Modal8C_PipPlan isOpen={activeModal === 'modal8C'} onClose={closeModal} payload={modalPayload} />
      <Modal8D_NineBoxDetail isOpen={activeModal === 'modal8D'} onClose={closeModal} payload={modalPayload} />
    </>
  );
}
