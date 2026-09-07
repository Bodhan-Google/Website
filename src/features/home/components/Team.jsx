import React from 'react';
import { Link } from 'react-router-dom';
import Container from './Container';
import SectionHeading from './SectionHeading';
import Card from './Card';

import miteshImg from '../../../assets/mitesh-sir.png';
import balaramanImg from '../../../assets/Balaraman Ravindran.jpg';
import karthikRamanImg from '../../../assets/Karthik Raman.jpg';
import nandanImg from '../../../assets/Nandan Sudarsanam.jpg';
import neethiImg from '../../../assets/S Neethi.jpg';
import karthikMahaImg from '../../../assets/Karthik-Mahadevan.png';
import VeezhinathanImg from '../../../assets/prof-kamakoti.png';
import manuImg from '../../../assets/prof-manu.jpg';
import sumanImg from '../../../assets/Suman_Kundu.jpg';
import ganeshImg from '../../../assets/Ganesh-Krishnan.jpeg';
import anoopImg from '../../../assets/Anoop-Kunchukuttan.jpeg';
import { Linkedin, User } from 'lucide-react';

const Team = () => {
    const boardMembers = [
        {
            name: "Prof. Veezhinathan Kamakoti",
            role: "Director, IIT Madras",
            details: "",
            image: VeezhinathanImg
        },
        {
            name: "Prof. Balaraman Ravindran",
            role: "Head - DSAI, IIT Madras",
            details: "",
            image: balaramanImg
        },
        {
            name: "Prof. Manu Santhanam",
            role: "Dean - IC&SR, IIT Madras",
            details: "",
            image: manuImg
        },
    ];

    const row1 = [
        {
            name: "Prof. Mitesh Khapra",
            role: "Professor, IIT Madras",
            linkedin: "https://www.linkedin.com/in/mitesh-khapra-3bb3032/",
            image: miteshImg
        },
        {
            name: "Dr. S Neethi",
            role: "Professor of Practice, IIT Madras",
            linkedin: "https://www.linkedin.com/in/s-neethi/",
            image: neethiImg
        },
        {
            name: "Prof. Karthik Raman",
            role: "Professor, IIT Madras",
            linkedin: "https://www.linkedin.com/in/ramankarthik/",
            image: karthikRamanImg
        },
        {
            name: "Prof. Nandan Sudarsanam",
            role: "Professor, IIT Madras",
            linkedin: "https://www.linkedin.com/in/nandan-sudarsanam-67359b6/",
            image: nandanImg
        },
    ];

    const row2 = [
        {
            name: "Dr. Suman Kundu",
            role: "Assistant Professor, IIT Madras",
            linkedin: "https://www.linkedin.com/in/drskundu/",
            image: sumanImg
        },
        {
            name: "Mr. Karthik Mahadevan Mohanakrishnan",
            role: "COO, Bodhan AI",
            linkedin: "https://www.linkedin.com/in/karthikmaha/",
            image: karthikMahaImg
        },
        {
            name: "Dr. Anoop Kunchukuttan",
            role: "VP Research, Bodhan AI",
            linkedin: "https://in.linkedin.com/in/anoopkunchukuttan",
            image: anoopImg
        },
        {
            name: "Mr. Ganesh Krishnan",
            role: "VP Engineering, Bodhan AI",
            linkedin: "https://www.linkedin.com/in/ganesh-krishnan-6a8a93a/",
            image: ganeshImg
        },
    ];

    return (
        <Container className="pt-0 md:pt-20 pb-10 scroll-mt-32" id="team">
            <SectionHeading
                title="Our People"
                highlightWord="People"
                subtitle="The team driving the Bodhan mission forward."
                className="mb-8"
                parallax={true}
            />

            {/* Board Members Section */}
            <div id="board" className="mb-24 scroll-mt-32">
                <h3 className="text-3xl font-bold text-center mb-12 text-[#1A1A1A]">Board Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
                    <div className="lg:col-start-2 w-full">
                        {boardMembers[0] && <Card title={boardMembers[0].name} description={boardMembers[0].details ? `${boardMembers[0].role} — ${boardMembers[0].details}` : boardMembers[0].role} image={boardMembers[0].image} className="max-w-sm mx-auto w-full md:max-w-none" panelClassName="text-center" />}
                    </div>
                    <div className="w-full">
                        {boardMembers[1] && <Card title={boardMembers[1].name} description={boardMembers[1].details ? `${boardMembers[1].role} — ${boardMembers[1].details}` : boardMembers[1].role} image={boardMembers[1].image} className="max-w-sm mx-auto w-full md:max-w-none" panelClassName="text-center" />}
                    </div>
                    <div className="w-full">
                        {boardMembers[2] && <Card title={boardMembers[2].name} description={boardMembers[2].details ? `${boardMembers[2].role} — ${boardMembers[2].details}` : boardMembers[2].role} image={boardMembers[2].image} className="max-w-sm mx-auto w-full md:max-w-none" panelClassName="text-center" />}
                    </div>
                </div>
            </div>

            {/* Leadership / Org Chart Section */}
            <div className="mb-24">
                <h3 className="text-3xl font-inter font-semibold text-center mb-12 text-[#1A1A1A]">Leadership</h3>

                {/* Row 1: 4 members */}
                <div className="flex justify-center gap-24 flex-wrap mb-16">
                    {row1.map((member, index) => (
                        <div key={index} className="flex flex-col items-center text-center group w-40">
                            <div className="w-40 h-40 rounded-full bg-gray-100 mb-6 relative overflow-hidden flex items-center justify-center group-hover:ring-4 ring-orange-100 transition-all border border-gray-200">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <User size={48} className="text-gray-400" />
                                )}
                            </div>
                            <h3 className="text-lg font-100 text-gray-900 mb-1 leading-tight">{member.name}</h3>
                            {member.role && (
                                <p className="text-gray-500 text-sm mb-1">{member.role}</p>
                            )}
                            {member.linkedin && (
                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors mt-2">
                                    <Linkedin size={16} fill="currentColor" strokeWidth={0} />
                                </a>
                            )}
                        </div>
                    ))}
                </div>

                {/* Row 2: 4 members */}
                <div className="flex justify-center gap-24 flex-wrap">
                    {row2.map((member, index) => (
                        <div key={index} className="flex flex-col items-center text-center group w-40">
                            <div className="w-40 h-40 rounded-full bg-gray-100 mb-6 relative overflow-hidden flex items-center justify-center group-hover:ring-4 ring-orange-100 transition-all border border-gray-200">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <User size={48} className="text-gray-400" />
                                )}
                            </div>
                            <h3 className="text-lg font-100 text-gray-900 mb-1 leading-tight">{member.name}</h3>
                            {member.role && (
                                <p className="text-gray-500 text-sm mb-1">{member.role}</p>
                            )}
                            {member.linkedin && (
                                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors mt-2">
                                    <Linkedin size={16} fill="currentColor" strokeWidth={0} />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Advisory Board Section */}
            <div id="advisory" className="mb-2 scroll-mt-32 text-center">
                <h3 className="text-3xl font-bold mb-4 text-[#1A1A1A]">International Advisory Council</h3>
                <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto mb-8">
                    Distinguished global leaders guiding Bodhan AI's vision for transforming education through Artificial Intelligence.
                </p>
                <Link
                    to="/advisory-council"
                    onClick={() => window.scrollTo(0, 0)}
                    className="inline-block bg-[#0a0a0a] text-white text-sm md:text-base font-medium py-3 px-7 rounded-[10px] hover:bg-black transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-px"
                >
                    International Advisory Council
                </Link>
            </div>
        </Container>
    );
};

export default Team;
