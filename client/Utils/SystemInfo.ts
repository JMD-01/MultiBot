import {baseboard, bios, cpu, diskLayout, osInfo} from "systeminformation";
import * as OS from "os";

const pidusage = require("pidusage");

export interface InitialSystemInfo {
    OSData: OSData,
    CpuInfo: CpuInfo,
    BiosInfo: BiosInfo
}
export interface OSData {
    platform: string,
    distro: string,
    release: string,
    arch: string,
    hostname: string,
    username: string,
    build: string,
    pid: string,
    node: string,
    disk: string,
    diskSize: string
}
export interface CpuInfo {
    manufacturer: string,
    brand: string,
    vendor: string,
    revision: string,
    ram: string,
    speed: string,
    cores: string,
    physicalCores: string,
    processors: string,
    socket: string,
    virtualization: string
}
export interface BiosInfo{
    manufacturer: string,
    model: string,
    vendor: string,
    releaseDate: string
}
export interface SystemUsage{
    cpuUsage: string,
    memoryUsage: string,
    uptime: string
}
export function formatBytes(bytes: number) {
    let marker = 1024; /* Change to 1000 if required*/
    let decimal = 2; /* Change as required*/
    let kiloBytes = marker; /* One Kilobyte is 1024 bytes*/
    let megaBytes = marker * marker; /* One MB is 1024 KB*/
    let gigaBytes = marker * marker * marker; /* One GB is 1024 MB*/
    let teraBytes = marker * marker * marker * marker; /* One TB is 1024 GB*/

    /* return bytes if less than a KB*/
    if (bytes < kiloBytes) return bytes + " Bytes";
    /* return KB if less than a MB*/
    else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed(decimal) + " KB";
    /* return MB if less than a GB*/
    else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed(decimal) + " MB";
    /* return GB if less than a TB*/
    else return (bytes / gigaBytes).toFixed(decimal) + " GB";
}
function secondsToHms(d: number) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}

export async function SystemInfo(): Promise<InitialSystemInfo>{
    let [
        siOsInfo,
        siDiskLayout,
        siCpu,
        siBios,
        siBaseboard
        ] = await Promise.all([
        osInfo(),
        diskLayout(),
        cpu(),
        bios(),
        baseboard()
        ]);
    let OSInfo: OSData = {
        arch: siOsInfo.arch,
        build: siOsInfo.build,
        disk: siDiskLayout.length === 0 ? 'Disk' : siDiskLayout[0].name,
        diskSize: formatBytes(siDiskLayout.length === 0 ? 1000000 : siDiskLayout[0].size),
        distro: siOsInfo.distro,
        hostname: siOsInfo.hostname,
        node: process.version,
        pid: process.pid.toString(),
        platform: siOsInfo.platform,
        release: siOsInfo.release,
        username: OS.userInfo().username
    };
    let cpuInfo: CpuInfo = {
        brand: siCpu.brand,
        cores: siCpu.cores.toString(),
        manufacturer: siCpu.manufacturer,
        physicalCores: siCpu.physicalCores.toString(),
        processors: siCpu.processors.toString(),
        ram: formatBytes(OS.totalmem()),
        revision: siCpu.revision,
        socket: siCpu.socket,
        speed: OS.cpus()[0].speed.toString(),
        vendor: siCpu.vendor,
        virtualization: siCpu.virtualization.toString()
    }
    let biosInfo: BiosInfo = {
        manufacturer: siBaseboard.manufacturer,
        model: siBaseboard.model,
        releaseDate: siBios.releaseDate,
        vendor: siBios.vendor

    }
    return {
        OSData: OSInfo,
        CpuInfo: cpuInfo,
        BiosInfo: biosInfo
    }
}

export async function UsageInfo(): Promise<SystemUsage>{
    let usage = await pidusage(process.pid);
    let cpuPercentage = usage.cpu.toString();
    let memoryMB = formatBytes(usage.memory);
    let uptime = secondsToHms(process.uptime());
    return {
        cpuUsage: cpuPercentage,
        memoryUsage: memoryMB,
        uptime: uptime
    }
}