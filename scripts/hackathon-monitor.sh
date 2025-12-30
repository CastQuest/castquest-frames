#!/bin/bash

# 🏆 CastQuest Hackathon 2026 - System Monitor
# Real-time monitoring for all supercharged components

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# API endpoints
ADMIN_URL=${ADMIN_URL:-"http://localhost:3010"}
API_URL="$ADMIN_URL/api"

# Function to make API calls
api_call() {
    local endpoint=$1
    curl -s "$API_URL/$endpoint" 2>/dev/null || echo "{\"error\": \"Failed to connect\"}"
}

# Function to get status color
get_status_color() {
    local status=$1
    case $status in
        "operational"|"healthy"|"OPTIMAL"|"active")
            echo "$GREEN"
            ;;
        "degraded"|"warning")
            echo "$YELLOW"
            ;;
        "down"|"error"|"failed")
            echo "$RED"
            ;;
        *)
            echo "$CYAN"
            ;;
    esac
}

# Function to format number with commas
format_number() {
    printf "%'d" $1 2>/dev/null || echo $1
}

# Function to display header
show_header() {
    clear
    echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║${NC}   🏆 ${CYAN}CastQuest Hackathon 2026 - System Monitor${NC}   ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}╠═══════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${MAGENTA}║${NC}   $(date '+%Y-%m-%d %H:%M:%S')   Refresh: Every 5 seconds      ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Function to display system status
show_system_status() {
    echo -e "${BLUE}━━━ System Status ━━━${NC}"
    
    local status_data=$(api_call "status")
    
    # Parse and display each component
    echo "$status_data" | jq -r '.components[] | "\(.name)|\(.status)"' 2>/dev/null | while IFS='|' read -r name status; do
        local color=$(get_status_color "$status")
        printf "  %-30s ${color}%-12s${NC}\n" "$name" "$status"
    done || echo "  ${YELLOW}Unable to fetch system status${NC}"
    
    echo ""
}

# Function to display Oracle stats
show_oracle_stats() {
    echo -e "${BLUE}━━━ Oracle Database ━━━${NC}"
    
    local oracle_data=$(api_call "oracle/stats")
    
    if echo "$oracle_data" | jq -e .oracle.connected >/dev/null 2>&1; then
        local connected=$(echo "$oracle_data" | jq -r '.oracle.connected')
        local sync_status=$(echo "$oracle_data" | jq -r '.oracle.syncStatus')
        local last_sync=$(echo "$oracle_data" | jq -r '.oracle.lastSync')
        
        local conn_color=$([ "$connected" = "true" ] && echo "$GREEN" || echo "$RED")
        local sync_color=$(get_status_color "$sync_status")
        
        printf "  %-30s ${conn_color}%-12s${NC}\n" "Connection" "$([ "$connected" = "true" ] && echo "CONNECTED" || echo "DISCONNECTED")"
        printf "  %-30s ${sync_color}%-12s${NC}\n" "Sync Status" "$sync_status"
        printf "  %-30s ${CYAN}%-12s${NC}\n" "Last Sync" "$last_sync"
        
        # Tables
        echo ""
        echo -e "  ${CYAN}Tables:${NC}"
        echo "$oracle_data" | jq -r '.frames, .quests, .mints, .workers' 2>/dev/null | {
            local frames_total=$(echo "$oracle_data" | jq -r '.frames.total')
            local frames_active=$(echo "$oracle_data" | jq -r '.frames.active')
            local quests_total=$(echo "$oracle_data" | jq -r '.quests.total')
            local quests_active=$(echo "$oracle_data" | jq -r '.quests.active')
            local mints_total=$(echo "$oracle_data" | jq -r '.mints.total')
            local mints_pending=$(echo "$oracle_data" | jq -r '.mints.pending')
            local workers_total=$(echo "$oracle_data" | jq -r '.workers.total')
            local workers_active=$(echo "$oracle_data" | jq -r '.workers.active')
            
            printf "    Frames:  ${GREEN}%6s${NC} total, ${GREEN}%6s${NC} active\n" "$(format_number $frames_total)" "$(format_number $frames_active)"
            printf "    Quests:  ${GREEN}%6s${NC} total, ${GREEN}%6s${NC} active\n" "$(format_number $quests_total)" "$(format_number $quests_active)"
            printf "    Mints:   ${GREEN}%6s${NC} total, ${YELLOW}%6s${NC} pending\n" "$(format_number $mints_total)" "$(format_number $mints_pending)"
            printf "    Workers: ${GREEN}%6s${NC} total, ${GREEN}%6s${NC} active\n" "$(format_number $workers_total)" "$(format_number $workers_active)"
        }
    else
        echo "  ${YELLOW}Oracle database not connected${NC}"
    fi
    
    echo ""
}

# Function to display Brain stats
show_brain_stats() {
    echo -e "${BLUE}━━━ Smart Brain AI ━━━${NC}"
    
    local oracle_data=$(api_call "oracle/stats")
    
    if echo "$oracle_data" | jq -e .brain >/dev/null 2>&1; then
        local events=$(echo "$oracle_data" | jq -r '.brain.events')
        local suggestions=$(echo "$oracle_data" | jq -r '.brain.suggestions')
        local patterns=$(echo "$oracle_data" | jq -r '.brain.patterns')
        
        printf "  %-30s ${GREEN}%s${NC}\n" "Events Processed" "$(format_number $events)"
        printf "  %-30s ${GREEN}%s${NC}\n" "Active Suggestions" "$(format_number $suggestions)"
        printf "  %-30s ${GREEN}%s${NC}\n" "Patterns Discovered" "$(format_number $patterns)"
        printf "  %-30s ${CYAN}%s${NC}\n" "Parallel Workers" "4"
        printf "  %-30s ${GREEN}%s${NC}\n" "Deep Thinking Mode" "ENABLED"
    else
        echo "  ${YELLOW}Unable to fetch brain stats${NC}"
    fi
    
    echo ""
}

# Function to display worker stats
show_worker_stats() {
    echo -e "${BLUE}━━━ Autonomous Workers ━━━${NC}"
    
    local oracle_data=$(api_call "oracle/stats")
    
    if echo "$oracle_data" | jq -e .workers >/dev/null 2>&1; then
        local total=$(echo "$oracle_data" | jq -r '.workers.total')
        local active=$(echo "$oracle_data" | jq -r '.workers.active')
        local idle=$(echo "$oracle_data" | jq -r '.workers.idle')
        
        printf "  %-30s ${GREEN}%s${NC}\n" "Total Workers" "$total"
        printf "  %-30s ${GREEN}%s${NC}\n" "Active" "$active"
        printf "  %-30s ${CYAN}%s${NC}\n" "Idle" "$idle"
        
        # Worker efficiency
        if [ "$total" -gt 0 ]; then
            local efficiency=$((active * 100 / total))
            local eff_color=$GREEN
            [ $efficiency -lt 50 ] && eff_color=$YELLOW
            [ $efficiency -lt 25 ] && eff_color=$RED
            printf "  %-30s ${eff_color}%s%%${NC}\n" "Efficiency" "$efficiency"
        fi
    else
        echo "  ${YELLOW}Unable to fetch worker stats${NC}"
    fi
    
    echo ""
}

# Function to display performance metrics
show_performance() {
    echo -e "${BLUE}━━━ Performance Metrics ━━━${NC}"
    
    # CPU and Memory
    if command -v ps &> /dev/null; then
        local node_cpu=$(ps aux | grep "[n]ode" | awk '{sum+=$3} END {printf "%.1f", sum}')
        local node_mem=$(ps aux | grep "[n]ode" | awk '{sum+=$4} END {printf "%.1f", sum}')
        
        printf "  %-30s ${GREEN}%-12s${NC}\n" "Node CPU Usage" "${node_cpu}%"
        printf "  %-30s ${GREEN}%-12s${NC}\n" "Node Memory Usage" "${node_mem}%"
    fi
    
    # Port status
    local admin_port=$(lsof -ti:3010 | wc -l)
    local web_port=$(lsof -ti:3000 | wc -l)
    
    local admin_color=$([ "$admin_port" -gt 0 ] && echo "$GREEN" || echo "$RED")
    local web_color=$([ "$web_port" -gt 0 ] && echo "$GREEN" || echo "$RED")
    
    printf "  %-30s ${admin_color}%-12s${NC}\n" "Admin Server (3010)" "$([ "$admin_port" -gt 0 ] && echo "RUNNING" || echo "STOPPED")"
    printf "  %-30s ${web_color}%-12s${NC}\n" "Web Server (3000)" "$([ "$web_port" -gt 0 ] && echo "RUNNING" || echo "STOPPED")"
    
    echo ""
}

# Function to display quick actions
show_actions() {
    echo -e "${BLUE}━━━ Quick Actions ━━━${NC}"
    echo "  [s] Trigger Oracle Sync"
    echo "  [b] Trigger Brain Deep Think"
    echo "  [w] Trigger Worker"
    echo "  [r] Refresh Now"
    echo "  [q] Quit"
    echo ""
}

# Function to trigger Oracle sync
trigger_oracle_sync() {
    echo -e "${CYAN}Triggering Oracle sync...${NC}"
    curl -s -X POST "$API_URL/oracle/sync" | jq '.' 2>/dev/null || echo "Failed to trigger sync"
    sleep 2
}

# Function to trigger Brain deep think
trigger_brain_think() {
    echo -e "${CYAN}Triggering Brain deep think...${NC}"
    curl -s -X POST "$API_URL/brain/deep-think" \
        -H "Content-Type: application/json" \
        -d '{"context":"monitor-trigger","data":{}}' | jq '.' 2>/dev/null || echo "Failed to trigger deep think"
    sleep 2
}

# Function to trigger worker
trigger_worker() {
    echo -e "${CYAN}Triggering worker...${NC}"
    curl -s -X POST "$API_URL/strategy/worker/run" | jq '.' 2>/dev/null || echo "Failed to trigger worker"
    sleep 2
}

# Main monitoring loop
monitor_loop() {
    while true; do
        show_header
        show_system_status
        show_oracle_stats
        show_brain_stats
        show_worker_stats
        show_performance
        show_actions
        
        # Non-blocking read with timeout
        read -t 5 -n 1 action
        case $action in
            s|S) trigger_oracle_sync ;;
            b|B) trigger_brain_think ;;
            w|W) trigger_worker ;;
            r|R) continue ;;
            q|Q) break ;;
        esac
    done
    
    echo ""
    echo -e "${GREEN}Monitor stopped${NC}"
}

# Check dependencies
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is required for this script${NC}"
    echo "Install with: apt-get install jq  or  brew install jq"
    exit 1
fi

if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl is required for this script${NC}"
    exit 1
fi

# Start monitoring
echo -e "${CYAN}Starting CastQuest Hackathon 2026 Monitor...${NC}"
echo -e "${CYAN}Connecting to $ADMIN_URL${NC}"
sleep 1

monitor_loop
