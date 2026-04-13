/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Info, 
  FileText, 
  Home, 
  CreditCard,
  ChevronRight,
  Menu,
  X,
  Heart,
  ShieldCheck,
  Users,
  LogOut,
  Trash2,
  CheckCircle2,
  Car,
  Coffee,
  Bath,
  Maximize2
} from "lucide-react";
import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { db } from "./lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  updateDoc, 
  doc, 
  deleteDoc,
  onSnapshot
} from "firebase/firestore";

const mortuaryData = [
  { id: 1, name: "김*수", room: "특1호실", date: "2024.04.15 09:00", status: "입관중" },
  { id: 2, name: "이*자", room: "201호", date: "2024.04.14 11:30", status: "빈소안내" },
  { id: 3, name: "박*호", room: "302호", date: "2024.04.16 08:00", status: "발인예정" },
  { id: 4, name: "최*영", room: "501호", date: "2024.04.15 13:00", status: "빈소안내" },
];

const quickLinks = [
  { title: "장례절차", icon: <FileText className="w-5 h-5" />, color: "bg-slate-100" },
  { title: "시설안내", icon: <Home className="w-5 h-5" />, color: "bg-slate-100" },
  { title: "비용안내", icon: <CreditCard className="w-5 h-5" />, color: "bg-slate-100" },
  { title: "오시는길", icon: <MapPin className="w-5 h-5" />, color: "bg-slate-100" },
];

const facilityTabs = [
  { id: "public", label: "공동시설" },
  { id: "rooms", label: "빈소/객실" },
  { id: "convenience", label: "편의시설" },
];

const publicFacilities = [
  { name: "인포메이션", image: "https://picsum.photos/seed/info/800/600" },
  { name: "장례식장 로비", image: "https://picsum.photos/seed/lobby/800/600" },
  { name: "예배실", image: "https://picsum.photos/seed/chapel/800/600" },
  { name: "예식실", image: "https://picsum.photos/seed/ceremony/800/600" },
  { name: "입관실", image: "https://picsum.photos/seed/encoffin/800/600" },
  { name: "분향실", image: "https://picsum.photos/seed/incense/800/600" },
];

const roomDetails = [
  { room: "1호실", info: "지하1층 / 80평 / 수용인원 85명 미만 / 분향소, 상주실(1개), 접객실, 주방", image: "https://picsum.photos/seed/room1/1200/800" },
  { room: "101호", info: "1층 / 60평 / 수용인원 60명 미만 / 분향소, 상주실(1개), 접객실, 주방", image: "https://picsum.photos/seed/room101/1200/800" },
  { room: "특201~2 / 특301", info: "2,3층 / 120평 / 수용인원 150명 미만 / 분향소, 상주실(1개), 접객실, 주방", image: "https://picsum.photos/seed/roomvip/1200/800" },
  { room: "302~303호", info: "3층 / 70평 / 수용인원 70명 미만 / 분향소, 상주실(1개), 접객실, 주방", image: "https://picsum.photos/seed/room302/1200/800" },
  { room: "4층 귀빈실", info: "4층 / 150평 / 수용인원 200명 미만 / 분향소, 상주실(2개), 접객실, 주방", image: "https://picsum.photos/seed/room4f/1200/800" },
];

const facilitySubTabs = [
  { id: "public", label: "시설안내" },
  { id: "rooms", label: "빈소/객실안내" },
  { id: "convenience", label: "편의시설" },
  { id: "parking", label: "주차시설" },
];

const convenienceFacilities = [
  { name: "테라스 (주간)", image: "https://picsum.photos/seed/terrace_day/800/600" },
  { name: "테라스 (야간)", image: "https://picsum.photos/seed/terrace_night/800/600" },
  { name: "샤워실 / 탈의실", image: "https://picsum.photos/seed/shower_room/800/600" },
  { name: "샤워실", image: "https://picsum.photos/seed/shower_only/800/600" },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [view, setView] = useState<"home" | "facilities" | "directions">("home");
  const [activeTab, setActiveTab] = useState("public");
  const [activeRoom, setActiveRoom] = useState(0);
  
  // Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    phone: "",
    content: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin Login State
  const [loginForm, setLoginForm] = useState({
    id: "",
    password: ""
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAdminMode) {
      const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setInquiries(data);
      });
      return () => unsubscribe();
    }
  }, [isAdminMode]);

  const handleInquirySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.phone || !inquiryForm.content) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "inquiries"), {
        ...inquiryForm,
        status: "pending",
        createdAt: serverTimestamp()
      });
      alert("상담 문의가 접수되었습니다. 곧 연락드리겠습니다.");
      setInquiryForm({ name: "", phone: "", content: "" });
      setIsInquiryModalOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    if (loginForm.id === "admin" && loginForm.password === "admin") {
      setIsAdminMode(true);
      setIsAdminLoginOpen(false);
      setLoginForm({ id: "", password: "" });
    } else {
      alert("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "pending" ? "completed" : "pending";
    try {
      await updateDoc(doc(db, "inquiries", id), {
        status: nextStatus
      });
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteDoc(doc(db, "inquiries", id));
      } catch (error) {
        console.error("Error deleting inquiry: ", error);
      }
    }
  };

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <nav className="bg-brand-dark text-white p-6 shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                <span className="font-bold">誠</span>
              </div>
              <h1 className="text-xl font-bold">상담 관리 시스템</h1>
            </div>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 gap-2"
              onClick={() => setIsAdminMode(false)}
            >
              <LogOut className="w-4 h-4" /> 로그아웃
            </Button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-8">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold mb-2">상담 문의 목록</h2>
              <p className="text-slate-500">실시간으로 접수된 상담 문의를 확인하고 관리합니다.</p>
            </div>
            <Badge className="bg-blue-600 px-4 py-1 text-sm">{inquiries.length}건 접수됨</Badge>
          </div>

          <div className="grid gap-6">
            {inquiries.length === 0 ? (
              <div className="bg-white p-20 rounded-3xl text-center border border-slate-200">
                <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">접수된 문의가 없습니다.</p>
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <motion.div 
                  key={inquiry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-brand-dark font-bold">
                        {inquiry.name[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{inquiry.name}</h3>
                        <p className="text-blue-600 font-bold">{inquiry.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={inquiry.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}>
                        {inquiry.status === 'completed' ? '처리완료' : '대기중'}
                      </Badge>
                      <span className="text-xs text-slate-400 font-bold">
                        {inquiry.createdAt?.toDate().toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl mb-6 text-slate-700 leading-relaxed font-medium">
                    {inquiry.content}
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      className={`rounded-xl gap-2 ${inquiry.status === 'completed' ? 'text-amber-600 border-amber-200 hover:bg-amber-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                      onClick={() => handleUpdateStatus(inquiry.id, inquiry.status)}
                    >
                      <CheckCircle2 className="w-4 h-4" /> 
                      {inquiry.status === 'completed' ? '대기로 변경' : '처리완료'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl gap-2"
                      onClick={() => handleDeleteInquiry(inquiry.id)}
                    >
                      <Trash2 className="w-4 h-4" /> 삭제
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </main>
      </div>
    );
  }

  if (view === "directions") {
    return (
      <div className="min-h-screen bg-white font-sans text-brand-dark">
        {/* Navigation */}
        <nav className="sticky top-0 w-full z-50 bg-white shadow-md py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 bg-white px-6">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("home")}>
                <div className="w-9 h-9 bg-brand-dark rounded-lg flex items-center justify-center shadow-inner">
                  <span className="text-brand-beige font-heading text-lg font-bold">誠</span>
                </div>
                <span className="font-heading text-xl font-bold tracking-tight text-brand-dark">군산시민장례문화원</span>
              </div>
              <div className="hidden md:flex items-center gap-10 font-bold text-sm tracking-tight">
                <a href="#" onClick={(e) => { e.preventDefault(); setView("home"); }} className="hover:text-blue-600 transition-colors">실시간 빈소 현황</a>
                <a href="#" className="hover:text-blue-600 transition-colors">장례안내</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setView("facilities"); setActiveTab("public"); }} className="hover:text-blue-600 transition-colors">시설안내</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setView("directions"); }} className="text-blue-600 transition-colors">오시는길</a>
                <a href="#" className="hover:text-blue-600 transition-colors">사이버추모관</a>
                <Button onClick={() => setIsInquiryModalOpen(true)} className="bg-brand-dark text-brand-beige hover:bg-slate-800 rounded-lg px-6">상담문의</Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="flex justify-end items-center gap-2 text-xs text-slate-400 mb-8 font-medium">
            <Home className="w-3 h-3" />
            <ChevronRight className="w-3 h-3" />
            <span>오시는길</span>
          </div>

          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-brand-dark tracking-tight mb-4">오시는 길</h1>
            <p className="text-slate-500 font-medium">군산시민장례문화원을 찾아오시는 방법을 안내해 드립니다.</p>
          </div>

          {/* Map Section */}
          <div className="mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 aspect-[21/9] w-full bg-slate-100">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3211.838507317789!2d126.7572052!3d35.9807414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35705d001096748f%3A0x80b4f58484cb2636!2z6rWw7IKw7Iuc66-87J6l66GA66y47ZmU7JuQ!5e0!3m2!1sko!2skr!4v1713000000000!5m2!1sko!2skr" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Train */}
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-xl transition-all p-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">기차 이용 시</h3>
              <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                <p className="text-brand-dark font-bold">군산역 하차</p>
                <p>• 택시 이용: 군산역에서 약 10분 소요</p>
                <p>• 버스 이용: 제일고 방면 시내버스 탑승후 잠두마을 인근 하차후 도보 이동(600m)</p>
              </div>
            </Card>

            {/* Bus */}
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-xl transition-all p-8">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">고속/시외버스 이용 시</h3>
              <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                <p className="text-brand-dark font-bold">군산 고속/시외버스 터미널 하차</p>
                <p>• 택시 이용: 터미널에서 약 15분 소요</p>
                <p>• 버스 이용: 제일고 방면 시내버스 탑승후 잠두마을 인근 하차후 도보 이동(600m)</p>
              </div>
            </Card>

            {/* Car */}
            <Card className="rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-xl transition-all p-8">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">자가용 이용 시</h3>
              <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                <p className="text-brand-dark font-bold">네비게이션 검색</p>
                <p>• '군산시민장례문화원' 검색</p>
                <p>• 주소: 전북 군산시 잠두1길 49</p>
                <p className="text-blue-600 font-bold mt-4">※ 150대 동시 주차 가능한 대형 주차장 완비</p>
              </div>
            </Card>
          </div>
        </main>

        <footer className="bg-slate-900 text-slate-400 py-12 px-4 mt-20">
          <div className="max-w-7xl mx-auto text-center text-xs font-bold tracking-wider">
            <p>© 2024 GUNSAN CITIZEN FUNERAL CULTURE CENTER. ALL RIGHTS RESERVED.</p>
          </div>
        </footer>
      </div>
    );
  }

  if (view === "facilities") {
    return (
      <div className="min-h-screen bg-white font-sans text-brand-dark">
        {/* Navigation (Same as Home) */}
        <nav className="sticky top-0 w-full z-50 bg-white shadow-md py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 bg-white px-6">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("home")}>
                <div className="w-9 h-9 bg-brand-dark rounded-lg flex items-center justify-center shadow-inner">
                  <span className="text-brand-beige font-heading text-lg font-bold">誠</span>
                </div>
                <span className="font-heading text-xl font-bold tracking-tight text-brand-dark">군산시민장례문화원</span>
              </div>
              <div className="hidden md:flex items-center gap-10 font-bold text-sm tracking-tight">
                <a href="#" onClick={(e) => { e.preventDefault(); setView("home"); }} className="hover:text-blue-600 transition-colors">실시간 빈소 현황</a>
                <a href="#" className="hover:text-blue-600 transition-colors">장례안내</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setView("facilities"); setActiveTab("public"); }} className="text-blue-600 transition-colors">시설안내</a>
                <a href="#" className="hover:text-blue-600 transition-colors">사이버추모관</a>
                <Button onClick={() => setIsInquiryModalOpen(true)} className="bg-brand-dark text-brand-beige hover:bg-slate-800 rounded-lg px-6">상담문의</Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Sub Navigation */}
        <div className="bg-[#1e5aa0] w-full">
          <div className="max-w-7xl mx-auto flex">
            {facilitySubTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 text-center font-bold text-sm transition-all border-r border-white/10 last:border-none ${
                  activeTab === tab.id 
                  ? "bg-white text-[#1e5aa0]" 
                  : "bg-[#1e5aa0] text-white hover:bg-[#164a85]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="flex justify-end items-center gap-2 text-xs text-slate-400 mb-8 font-medium">
            <Home className="w-3 h-3" />
            <ChevronRight className="w-3 h-3" />
            <span>시설안내</span>
            {activeTab !== "public" && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span>{facilitySubTabs.find(t => t.id === activeTab)?.label}</span>
              </>
            )}
          </div>

          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-brand-dark tracking-tight">
              {facilitySubTabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "public" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                  {publicFacilities.map((f, i) => (
                    <div key={i} className="space-y-4">
                      <div className="aspect-[16/9] overflow-hidden rounded-sm shadow-sm">
                        <img src={f.image} alt={f.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex gap-4 text-lg font-medium">
                        <span className="text-slate-400">공동시설</span>
                        <span className="text-brand-dark">{f.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "rooms" && (
                <div className="space-y-12">
                  <div className="flex flex-wrap justify-center gap-2">
                    {roomDetails.map((room, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveRoom(i)}
                        className={`px-8 py-3 border border-slate-200 text-sm font-bold transition-all min-w-[160px] ${
                          activeRoom === i 
                          ? "bg-slate-500 text-white border-slate-500" 
                          : "bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {room.room}
                      </button>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xl font-bold text-brand-dark">
                      {roomDetails[activeRoom].room} ({roomDetails[activeRoom].info})
                    </p>
                  </div>

                  <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm shadow-lg group">
                    <img 
                      src={roomDetails[activeRoom].image} 
                      alt={roomDetails[activeRoom].room} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/40 text-white flex items-center justify-center rounded-full backdrop-blur-sm transition-all">
                      <ChevronRight className="w-8 h-8 rotate-180" />
                    </button>
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/40 text-white flex items-center justify-center rounded-full backdrop-blur-sm transition-all">
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "convenience" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                  {convenienceFacilities.map((f, i) => (
                    <div key={i} className="space-y-4">
                      <div className="aspect-[16/9] overflow-hidden rounded-sm shadow-sm">
                        <img src={f.image} alt={f.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex gap-4 text-lg font-medium">
                        <span className="text-slate-400">편의시설</span>
                        <span className="text-brand-dark">{f.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "parking" && (
                <div className="space-y-8">
                  <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm shadow-lg group">
                    <img 
                      src="https://picsum.photos/seed/parking_main/1200/600" 
                      alt="주차시설" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/40 text-white flex items-center justify-center rounded-full backdrop-blur-sm transition-all">
                      <ChevronRight className="w-8 h-8 rotate-180" />
                    </button>
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 hover:bg-black/40 text-white flex items-center justify-center rounded-full backdrop-blur-sm transition-all">
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="aspect-video overflow-hidden rounded-sm border border-slate-200">
                        <img src={`https://picsum.photos/seed/parking${i}/400/200`} alt="주차장" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="bg-slate-900 text-slate-400 py-12 px-4 mt-20">
          <div className="max-w-7xl mx-auto text-center text-xs font-bold tracking-wider">
            <p>© 2024 GUNSAN CITIZEN FUNERAL CULTURE CENTER. ALL RIGHTS RESERVED.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-brand-dark selection:bg-brand-dark selection:text-white">
      {/* Top Bar */}
      <div className="hidden lg:block bg-brand-dark text-brand-beige py-2 text-xs font-medium border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> 24시 상담: 063-453-4444</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> 전북 군산시 잠두1길 49</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAdminLoginOpen(true)} 
              className="hover:text-white transition-colors"
            >
              로그인
            </button>
            <a href="#" className="hover:text-white transition-colors">부고장 작성</a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 lg:top-8 w-full z-50 transition-all duration-300 ${scrolled ? "lg:top-0 bg-white shadow-md py-2" : "bg-transparent py-4"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 bg-white/90 backdrop-blur-sm lg:rounded-xl shadow-lg px-6 border border-slate-100">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("home")}>
              <div className="w-9 h-9 bg-brand-dark rounded-lg flex items-center justify-center shadow-inner">
                <span className="text-brand-beige font-heading text-lg font-bold">誠</span>
              </div>
              <span className="font-heading text-xl font-bold tracking-tight text-brand-dark">군산시민장례문화원</span>
            </div>
            
            <div className="hidden md:flex items-center gap-10 font-bold text-sm tracking-tight">
              <a href="#" onClick={(e) => { e.preventDefault(); setView("home"); }} className="hover:text-blue-600 transition-colors">실시간 빈소 현황</a>
              <a href="#" className="hover:text-blue-600 transition-colors">장례안내</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setView("facilities"); setActiveTab("public"); }} className="hover:text-blue-600 transition-colors">시설안내</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setView("directions"); }} className="hover:text-blue-600 transition-colors">오시는길</a>
              <a href="#" className="hover:text-blue-600 transition-colors">사이버추모관</a>
              <Button 
                onClick={() => setIsInquiryModalOpen(true)}
                className="bg-brand-dark text-brand-beige hover:bg-slate-800 rounded-lg px-6"
              >
                상담문의
              </Button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-brand-dark">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-slate-200 px-4 py-6 flex flex-col gap-4 shadow-xl"
          >
            <a href="#" onClick={(e) => { e.preventDefault(); setView("home"); setIsMenuOpen(false); }} className="text-lg font-bold px-4 py-2 hover:bg-slate-50 rounded-lg">실시간 빈소</a>
            <a href="#" className="text-lg font-bold px-4 py-2 hover:bg-slate-50 rounded-lg">장례안내</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setView("facilities"); setActiveTab("public"); setIsMenuOpen(false); }} className="text-lg font-bold px-4 py-2 hover:bg-slate-50 rounded-lg">시설안내</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setView("directions"); setIsMenuOpen(false); }} className="text-lg font-bold px-4 py-2 hover:bg-slate-50 rounded-lg">오시는길</a>
            <Button 
              onClick={() => {
                setIsInquiryModalOpen(true);
                setIsMenuOpen(false);
              }}
              className="w-full bg-brand-dark text-brand-beige py-6 text-lg"
            >
              24시 상담문의
            </Button>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[75vh] min-h-[650px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=2070" 
            alt="Nature Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/40 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl text-white"
          >
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-6 px-4 py-1 text-sm backdrop-blur-sm">
              Gunsan Citizen Funeral Culture Center
            </Badge>
            <h1 className="font-heading text-5xl md:text-7xl mb-8 leading-[1.15] font-bold">
              가장 소중한 분의<br />
              <span className="text-blue-300">마지막 여정</span>을<br />
              함께하겠습니다.
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-10 font-medium leading-relaxed max-w-lg">
              군산시민장례문화원은 유가족의 슬픔을 진심으로 위로하며 
              품격 있는 장례 문화를 선도합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                onClick={() => setView("home")}
                className="bg-white text-brand-dark hover:bg-slate-100 px-10 py-7 text-lg font-bold rounded-xl shadow-lg"
              >
                실시간 빈소현황
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => { setView("facilities"); setActiveTab("public"); }}
                className="bg-black/20 border-2 border-white/60 text-white hover:bg-white hover:text-brand-dark px-10 py-7 text-lg font-bold rounded-xl backdrop-blur-md transition-all duration-300"
              >
                시설 및 서비스
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Quick Access Floating Panel */}
        <div className="absolute bottom-0 left-0 w-full z-20 translate-y-1/2 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-[2rem] shadow-2xl p-8 grid grid-cols-4 gap-8 border border-slate-100">
              {quickLinks.map((link, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    if (link.title === "시설안내") {
                      setView("facilities");
                      setActiveTab("public");
                    } else if (link.title === "오시는길") {
                      setView("directions");
                    }
                  }}
                  className="flex items-center gap-5 group cursor-pointer"
                >
                  <div className={`w-14 h-14 ${link.color} rounded-2xl flex items-center justify-center group-hover:bg-brand-dark group-hover:text-white transition-all duration-300`}>
                    {link.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{link.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">자세히 보기</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mortuary Status Section */}
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">실시간 빈소 현황</h2>
            <p className="text-slate-500 font-medium">현재 진행 중인 장례 일정을 실시간으로 안내해 드립니다.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Last Updated</p>
              <p className="font-bold text-slate-700">2024.04.13 18:50</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mortuaryData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row gap-8 items-center">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl font-bold text-brand-dark border border-slate-100 group-hover:bg-brand-dark group-hover:text-white transition-colors">
                  {item.room.replace("호실", "").replace("호", "")}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                    <Badge className="bg-blue-600 hover:bg-blue-700 rounded-full px-3">{item.room}</Badge>
                    <Badge variant="outline" className="border-slate-300 text-slate-500 rounded-full px-3">{item.status}</Badge>
                  </div>
                  <h3 className="text-3xl font-bold mb-3">故 {item.name} 님</h3>
                  <p className="text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-2">
                    <Clock className="w-4 h-4" /> 발인: {item.date}
                  </p>
                </div>
                <Button className="bg-white text-brand-dark border border-slate-200 hover:bg-brand-dark hover:text-white rounded-2xl px-8 py-6 font-bold shadow-sm">
                  부고보기
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl px-12 py-7 font-bold text-lg">
            전체 빈소현황 보기 <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Features / Why Us */}
      <section className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-4xl font-bold mb-8 leading-tight">
                군산시민장례문화원만의<br />
                <span className="text-blue-600">특별한 약속</span>
              </h2>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                우리는 단순한 장례 시설을 넘어, 고인에 대한 예우와 유가족의 
                치유를 최우선으로 생각합니다.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-lg">진심을 다하는 정성</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-lg">투명하고 정직한 비용</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-lg">전문 장례 지도사 상주</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
                <h3 className="text-2xl font-bold mb-4">최신식 편의시설</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  유가족과 조문객 모두가 편안하게 머무를 수 있도록 쾌적하고 
                  현대적인 휴게 공간과 식당을 운영합니다.
                </p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
                <h3 className="text-2xl font-bold mb-4">모바일 부고 서비스</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  언제 어디서든 신속하게 소식을 전할 수 있는 스마트 부고장 
                  시스템을 무료로 제공해 드립니다.
                </p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
                <h3 className="text-2xl font-bold mb-4">24시 긴급 출동</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  임종 시 연락 주시면 즉시 앰뷸런스 출동 및 장례 절차를 
                  원스톱으로 도와드립니다.
                </p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
                <h3 className="text-2xl font-bold mb-4">사이버 추모관</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  직접 방문하지 못하는 분들을 위해 온라인으로 헌화와 
                  추모의 글을 남길 수 있는 공간입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-brand-dark rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 border border-white rounded-full" />
            <div className="absolute bottom-10 right-10 w-96 h-96 border border-white rounded-full" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              도움이 필요하신가요?<br />
              <span className="text-blue-300">365일 24시간</span> 언제든 열려있습니다.
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="tel:063-453-4444" className="bg-white text-brand-dark hover:bg-slate-100 px-12 py-6 text-2xl font-bold rounded-2xl shadow-xl flex items-center gap-4 transition-all">
                <Phone className="w-8 h-8" /> 063-453-4444
              </a>
              <Button 
                onClick={() => setIsInquiryModalOpen(true)}
                className="bg-white text-brand-dark hover:bg-slate-100 px-12 py-6 text-2xl font-bold rounded-2xl shadow-xl h-auto flex items-center gap-4 transition-all"
              >
                <MessageSquare className="w-8 h-8" /> 온라인 상담문의
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-white font-heading text-lg font-bold">誠</span>
                </div>
                <span className="font-heading text-2xl font-bold tracking-tight text-white">군산시민장례문화원</span>
              </div>
              <p className="max-w-md mb-10 leading-relaxed text-slate-500 font-medium">
                우리는 고인의 마지막 여정이 품격 있고 평온하기를 바랍니다. 
                유가족의 슬픔을 함께 나누며 가장 힘든 순간에 정성을 다해 함께하겠습니다.
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                  <Info className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Contact</h4>
              <ul className="space-y-5 text-sm font-medium">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                  <span>54044 군산시 잠두1길 49</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>T. 063-453-4444</span>
                </li>
                <li className="flex items-center gap-3">
                  <FileText className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>F. 063-443-3111</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Menu</h4>
              <ul className="space-y-5 text-sm font-medium">
                <li><a href="#" className="hover:text-white transition-colors">실시간 빈소현황</a></li>
                <li><a href="#" className="hover:text-white transition-colors">장례절차 안내</a></li>
                <li><a href="#" className="hover:text-white transition-colors">시설 및 비용안내</a></li>
                <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="bg-white/5 mb-10" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold tracking-wider text-slate-600">
            <p>© 2024 GUNSAN CITIZEN FUNERAL CULTURE CENTER. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <span>사업자등록번호: 123-45-67890</span>
              <span>대표자: 홍길동</span>
            </div>
          </div>
        </div>
      </footer>
      {/* Inquiry Modal */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInquiryModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">상담 문의하기</h2>
                  <button onClick={() => setIsInquiryModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleInquirySubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">성함</label>
                    <input 
                      type="text" 
                      required
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="성함을 입력해 주세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">연락처</label>
                    <input 
                      type="tel" 
                      required
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({...inquiryForm, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="010-0000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">문의 내용</label>
                    <textarea 
                      required
                      rows={4}
                      value={inquiryForm.content}
                      onChange={(e) => setInquiryForm({...inquiryForm, content: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                      placeholder="문의하실 내용을 입력해 주세요"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-brand-dark text-brand-beige py-8 text-xl font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all"
                  >
                    {isSubmitting ? "접수 중..." : "상담 신청하기"}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {isAdminLoginOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminLoginOpen(false)}
              className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden p-10"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <span className="text-brand-beige text-2xl font-bold">誠</span>
                </div>
                <h2 className="text-2xl font-bold">관리자 로그인</h2>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="아이디"
                  value={loginForm.id}
                  onChange={(e) => setLoginForm({...loginForm, id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                />
                <input 
                  type="password" 
                  placeholder="비밀번호"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                />
                <Button type="submit" className="w-full bg-brand-dark text-white py-4 font-bold rounded-xl">
                  로그인
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
