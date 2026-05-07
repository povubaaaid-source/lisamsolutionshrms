"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import { 
  Plus, 
  FileText, 
  Trash2, 
  Eye, 
  Send,
  Calendar,
  DollarSign,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type ProposalRow = {
  id: number;
  lead: string;
  total: number;
  validTill: string;
  status: "waiting" | "accepted" | "declined";
};

const starterProposals: ProposalRow[] = [
  { id: 1, lead: "Lisam Solutions", total: 1500, validTill: "2026-06-01", status: "waiting" },
  { id: 2, lead: "Tech Prodigy", total: 2400, validTill: "2026-05-15", status: "accepted" },
  { id: 3, lead: "Global HR", total: 800, validTill: "2026-05-20", status: "declined" },
];

export default function ProposalsPage() {
  const [proposals] = useState<ProposalRow[]>(starterProposals);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="row bg-title mb-6">
            <div className="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                <h4 className="page-title m-0">
                    <FileText className="h-5 w-5 mr-2 inline-block text-primary" /> 
                    Proposals
                </h4>
            </div>
            <div className="col-lg-9 col-sm-8 col-md-8 col-xs-12 flex justify-end items-center space-x-2">
                <Link href="/proposals/create">
                    <Button className="btn-success btn-outline btn-sm">
                        Create Proposal <Plus className="h-4 w-4 ml-1 inline-block" />
                    </Button>
                </Link>
                <ol className="breadcrumb hidden-xs">
                    <li><Link href="/dashboard">Home</Link></li>
                    <li className="active">Proposals</li>
                </ol>
            </div>
        </div>

        {/* Proposals Table */}
        <div className="white-box p-0">
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th className="w-16">#</th>
                            <th>Lead / Client</th>
                            <th><DollarSign className="h-4 w-4 inline-block mr-1" /> Total</th>
                            <th><Calendar className="h-4 w-4 inline-block mr-1" /> Valid Till</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proposals.map((proposal) => (
                            <tr key={proposal.id}>
                                <td>{proposal.id}</td>
                                <td className="font-bold text-primary hover:underline cursor-pointer">
                                    <Link href={`/proposals/${proposal.id}`} className="flex items-center">
                                        <Briefcase className="h-3 w-3 mr-2 opacity-50" />
                                        {proposal.lead}
                                    </Link>
                                </td>
                                <td>${proposal.total.toLocaleString()}</td>
                                <td>{new Date(proposal.validTill).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                <td>
                                    <span className={`label ${
                                        proposal.status === 'accepted' ? 'label-success' :
                                        proposal.status === 'waiting' ? 'label-warning' : 'label-danger'
                                    }`}>
                                        {proposal.status}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <div className="flex justify-end space-x-1">
                                        <Link href={`/proposals/${proposal.id}`} className="btn-info btn-outline p-1 rounded hover:bg-info hover:text-white transition-all"><Eye className="h-4 w-4" /></Link>
                                        <button className="btn-success btn-outline p-1 rounded hover:bg-success hover:text-white transition-all"><Send className="h-4 w-4" /></button>
                                        <button className="btn-danger btn-outline p-1 rounded hover:bg-danger hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
